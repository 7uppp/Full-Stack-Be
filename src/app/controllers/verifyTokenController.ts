import {Request, Response} from "express";
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
export const verifyToken = (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const authToken = authHeader?.split(' ')[1];

    // Validate header and token presence
    if (!authHeader || !authToken) {
        return res.status(401).send('Unauthorized');
    }

    // Verify the token
    jwt.verify(authToken, ACCESS_TOKEN_SECRET, (err) => {
        if (err?.name === 'TokenExpiredError') {
            return res.status(401).send('Token has expired');
        } else if (err?.name === 'JsonWebTokenError') {
            return res.status(401).send('Invalid token');
        }
        // If verification is successful, respond with a 200 status code.
        return res.status(200).send('Token is valid');
    });

};

