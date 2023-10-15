import dbConnection from "../../loader/dbConnect";
import {Request,Response} from "express";
import {RowDataPacket} from "mysql2";
import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
dotenv.config()

interface RequestWithUserId extends Request {
    userId?: string;
}

const extractKeyFromS3URL = (url: string) => {
    const path = new URL(url).pathname;
    return path.startsWith("/") ? path.slice(1) : path;
};

const queryDatabase = (query: string, values: any[]): Promise<RowDataPacket[]> => {
    return new Promise((resolve, reject) => {
        dbConnection.query(query, values, (err, results: RowDataPacket[]) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

const getUserAvatar = async (req: RequestWithUserId, res: Response) => {
    try {
        const results: RowDataPacket[] = await queryDatabase(`SELECT avatarUrl FROM userinfo WHERE id = ?`, [req.userId]);

        if (results.length === 0) {
            return res.status(404).send({message: 'User not found'});
        }

        const avatarURL = results[0].avatarUrl;
        const key = extractKeyFromS3URL(avatarURL);
        const SignedAvatarUrl = await generateSignedUrlForS3(key);

        return res.status(200).send({avatarURL: SignedAvatarUrl});
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Internal server error'});
    }
};


const generateSignedUrlForS3 = async (key: string): Promise<string> => {
    try {
        const s3Client = new S3Client({
            credentials: {
                accessKeyId: process.env.accessKeyId as string,
                secretAccessKey: process.env.secretAccessKey as string,
            },
            region: process.env.AWS_REGION as string,
        });

        return await getSignedUrl(
            s3Client,
            new GetObjectCommand({Bucket: 'pawmingleuseravatar', Key: key}),
            {expiresIn: 3600}
        );
    } catch (error) {
        console.error("Error generating signed URL:", error);
        throw new Error("Failed to generate signed URL for S3");
    }
};


export default getUserAvatar;

