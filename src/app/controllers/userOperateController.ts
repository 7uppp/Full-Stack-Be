import {Request, Response} from 'express';
import {MulterError} from "multer";
import {S3Client, GetObjectCommand} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {RowDataPacket} from 'mysql2';
import {deleteFromS3} from "./uploadUserAvatarMiddleware";
import QueryDatabase from "../../utils/queryDatabase";
import dotenv from "dotenv";
dotenv.config();

interface MulterRequest extends Request {
    file?: any;
    userId?: string;
    multerError?: MulterError;
}


const checkForMulterErrors = (req: MulterRequest, res: Response): boolean => {
    if (!req.file || !req.file.location) {
        res.status(400).send({message: 'File upload failed.'});
        return true;
    }

    if (req.multerError && req.multerError.code === 'LIMIT_FILE_SIZE') {
        res.status(400).send({message: 'File size exceeds the limit. Please upload a file smaller than 1MB.'});
        return true;
    }

    if (!req.userId || req.userId === 'null') {
        res.status(400).send({message: 'User id should not be null.'});
        return true;
    }

    return false;
};

const updateAvatarInDB = async (userId: number, newAvatarUrl: string): Promise<string | null> => {
    const fetchAvatarQuery = `SELECT avatarUrl FROM userinfo WHERE id = ?`;
    const updateAvatarQuery = `UPDATE userinfo SET avatarUrl = ? WHERE id = ?`;

    // Fetch old avatar key
    const results = await QueryDatabase(fetchAvatarQuery, [userId]);
    const oldAvatarKey = results[0]?.avatarUrl || null;

    // Update with new avatar
    await QueryDatabase(updateAvatarQuery, [newAvatarUrl, userId]);

    return oldAvatarKey;
};

const deleteOldAvatarFromS3 = async (oldAvatarKey: string) => {
    const urlObj = new URL(decodeURIComponent(oldAvatarKey));
    const pathName = urlObj.pathname;
    const s3Key = pathName.substring(1);
    await deleteFromS3(s3Key);
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


const handleUpload = async (req: MulterRequest, res: Response) => {
    if (checkForMulterErrors(req, res)) return;

    if (!req.userId) {
        console.error("User ID is missing from the request.");
        return res.status(400).send({message: 'User ID is missing'});
    }

    const userId = parseInt(req.userId, 10);

    if (isNaN(userId)) {
        console.error("Invalid user ID provided.");
        return res.status(400).send({message: 'Invalid user ID'});
    }

    try {
        const oldAvatarKey = await updateAvatarInDB(userId, req.file.location);
        if (oldAvatarKey) await deleteOldAvatarFromS3(oldAvatarKey);

        const signedAvatarUrl = await generateSignedUrlForS3(req.file.key);
        return res.status(200).send({message: 'Upload successful!', signedAvatarUrl: signedAvatarUrl, userId: userId});

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({message: 'Internal server error'});
    }
};

export {handleUpload};

