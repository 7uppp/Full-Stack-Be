import {Response, Request} from 'express'
import dotenv from 'dotenv'
import dbConnection from '../../loader/dbConnect'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {RowDataPacket} from "mysql2";
import {validationResult} from "express-validator";
import config from '../config/config';
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {S3Client, GetObjectCommand, S3ClientConfig} from "@aws-sdk/client-s3";
dotenv.config()


const ACCESS_TOKEN_LIFETIME = config.ACCESS_TOKEN_EXPIRES_IN
const REFRESH_TOKEN_LIFETIME = config.REFRESH_TOKEN_EXPIRES_IN

const awsConfig: S3ClientConfig = {
    credentials: {
        accessKeyId: process.env.accessKeyId as string,
        secretAccessKey: process.env.secretAccessKey as string,
    },
    region: process.env.AWS_REGION as string,
};
const s3Client = new S3Client(awsConfig);

function extractKeyFromUrl(url: string): string {
    const baseUrl = "https://pawmingleuseravatar.s3.ap-southeast-2.amazonaws.com/";
    return url.replace(baseUrl, "");
}
async function generateSignedUrl(bucket: string, key: string): Promise<string> {
    try {
        const getObjectParams = {
            Bucket: bucket,
            Key: key,
        };
        return await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams), {
            expiresIn: 3600,
        });
    } catch (error) {
        console.error("Error generating signed URL:", error);
        throw new Error("Could not generate signed URL.");
    }
}
export const login = async (req: Request, res: Response) => {
    try {
        //get data from body
        const {email, password} = req.body
        // check if email, password is empty
        const errors = validationResult(req); //

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors});
        }

        //check if user already exists in database
        const getUserData = `SELECT * FROM userinfo WHERE email = ?`
        dbConnection.query(getUserData, [email], async (err, results: RowDataPacket[]) => {


            if (err) {
                return res.status(500).json({error: err})
            }
            if (results.length === 0) {
                return res.status(401).json({message: 'Email does not exist'})
            }

            const hashedPassword = results[0].password
            const username = results[0].username
            const userId = results[0].id
            const isMatch = await bcrypt.compare(password, hashedPassword)


            let avatarSignedUrl: string | null = null;
            if (results[0].avatarUrl) {
                const key = extractKeyFromUrl(results[0].avatarUrl);
                avatarSignedUrl = await generateSignedUrl('pawmingleuseravatar', key);
            }

            if (!isMatch) {
                return res.status(401).json({message: 'Password is incorrect'})
            }
            jwt.sign({userId,username,avatarSignedUrl}, config.ACCESS_TOKEN_SECRET as string, {expiresIn: ACCESS_TOKEN_LIFETIME}, (err, accessToken) => {
                if (err) {
                    return res.status(500).json({error: err})
                }
                jwt.sign({userId,username,avatarSignedUrl}, config.REFRESH_TOKEN_SECRET as string, {expiresIn: REFRESH_TOKEN_LIFETIME}, (err, refreshToken) => {
                    if (err) {
                        return res.status(500).json({error: err})
                    }
                    return res.status(200).json({
                        msg: 'Log in successful',
                        username: username,
                        accessToken,
                        refreshToken,
                        userId: userId,
                        avatarUrl: avatarSignedUrl
                    });

                })
            })
        })
    } catch (error) {
        res.status(500).json({error})
    }
}
