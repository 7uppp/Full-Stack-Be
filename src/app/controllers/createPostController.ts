import {Request, Response} from 'express';
import dbConnection from '../../loader/dbConnect';
import {RowDataPacket} from "mysql2";
import {validationResult} from "express-validator";

export const createPostController = async (req: Request & { userId?: string,username?:string }, res: Response) => {
    const errors = validationResult(req); //

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const {userId,username} = req; // userId is attached to req object by authMiddleware
    // console.log("userId:", userId);
    const {post} = req.body;

    if (!userId) {
        return res.status(400).json({message: 'User ID is missing'});
    }

    if (!username) {
        return res.status(400).json({message: 'username is missing'});
    }

    if (post.length > 200) {
        return res.status(400).json({message: 'Post must be less than 200 characters'});
    }
    const addPostQuery = `INSERT INTO posts (post, userId,userName) VALUES (?, ?,?)`;

    dbConnection.query(addPostQuery, [post, userId,username], (err, results: RowDataPacket[]) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({message: 'Internal server error'});
        }
        return res.status(201).json({message: 'Post created successfully', data: results});
    });
}
