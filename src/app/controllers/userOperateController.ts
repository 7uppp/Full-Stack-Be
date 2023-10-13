import {Request, Response} from 'express';
import dbConnection from "../../loader/dbConnect";
import {MulterError} from "multer";
import {S3Client, GetObjectCommand} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {RowDataPacket} from 'mysql2';
import {deleteFromS3} from "./uploadUserAvatarMiddleware";

interface MulterRequest extends Request {
    file?: any;
    userId?: string;
    multerError?: MulterError;
}

// Convert callback-based query to a Promise-based one
const queryAsync = (query: string, values?: any[]): Promise<RowDataPacket[]> => {
    return new Promise<RowDataPacket[]>((resolve, reject) => {
        dbConnection.query(query, values, (err, results) => {
            if (err) reject(err);
            else resolve(results as RowDataPacket[]);
        });
    });
};

const handleUpload = async (req: MulterRequest, res: Response) => {
    if (!req.file || !req.file.location) {
        return res.status(400).send({message: 'File upload failed.'});
    }

    if (req.multerError && req.multerError.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).send({message: 'File size exceeds the limit. Please upload a file smaller than 1MB.'});
    }

    if (!req.userId || req.userId === 'null') {
        return res.status(400).send({message: 'User id should not be null.'});
    }

    const userId = parseInt(req.userId, 10);
    const fetchAvatarQuery = `SELECT avatarUrl FROM userinfo WHERE id = ?`;
    const updateAvatarQuery = `UPDATE userinfo SET avatarUrl = ? WHERE id = ?`;

    let oldAvatarKey: string | null = null;

    try {
        // Fetch old avatar key
        const results = await queryAsync(fetchAvatarQuery, [userId]);
        oldAvatarKey = results[0]?.avatarUrl || null;
        // console.log('oldAvatarKey:', oldAvatarKey);

        // Update with new avatar
        await queryAsync(updateAvatarQuery, [req.file.location, userId]);
        if (oldAvatarKey) {
            const urlObj = new URL(decodeURIComponent(oldAvatarKey));  // decodeURIComponent() is needed to decode the URL-encoded space character
            const pathName = urlObj.pathname;  // get the path name from the URL
            const s3Key = pathName.substring(1);  // remove the leading slash from the path name

            // console.log('Extracted S3 Key:', s3Key);  //

            await deleteFromS3(s3Key);
        }
    } catch (err) {
        console.error('Database Error:', err);
        return res.status(500).send({message: 'Internal server error'});
    }

    try {
        const s3Client = new S3Client({
            credentials: {
                accessKeyId: process.env.accessKeyId as string,
                secretAccessKey: process.env.secretAccessKey as string,
            },
            region: process.env.AWS_REGION as string,
        });

        const signedAvatarUrl = await getSignedUrl(
            s3Client,
            new GetObjectCommand({Bucket: 'pawmingleuseravatar', Key: req.file.key}),
            {expiresIn: 3600} // valid for 1 hour
        );

        return res.status(200).send({message: 'Upload successful!', signedAvatarUrl: signedAvatarUrl, userId: userId});
    } catch (error) {
        console.error("Error generating signed URL:", error);
        return res.status(500).send({message: 'Internal server error while generating signed URL'});
    }
};

export {handleUpload};
