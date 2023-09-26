import {Request, Response} from 'express';
import dbConnection from '../../loader/dbConnect';
import {RowDataPacket} from "mysql2";
import {validationResult} from "express-validator";

export const createPostController = async (req: Request & { userId?: string }, res: Response) => {
    const errors = validationResult(req); //

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const userId = req.userId; // userId is attached to req object by authMiddleware
    // console.log("userId:", userId);
    const {title, content} = req.body;

    if (!userId) {
        return res.status(400).json({message: 'User ID is missing'});
    }

    const addPostQuery = `INSERT INTO posts (title, content, userId) VALUES (?, ?, ?)`;

    dbConnection.query(addPostQuery, [title, content, userId], (err, results: RowDataPacket[]) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({message: 'Internal server error'});
        }
        return res.status(201).json({message: 'Post created successfully', data: results});
    });
}
