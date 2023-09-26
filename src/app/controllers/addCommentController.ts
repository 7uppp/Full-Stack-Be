import {Response, Request} from 'express';
import dbConnection from '../../loader/dbConnect';
import {RowDataPacket} from "mysql2";
import {param} from "express-validator";

interface CommentRequestBody {
    content: string;
}

export const addComment = (req: Request & { userId?: string }, res: Response) => {
    const userIdStr = req.userId;
    // console.log("userIdStr:", userIdStr)

    if (!userIdStr) {
        return res.status(400).json({message: 'User ID is missing'});
    }

    // Convert userId from string to integer
    const userId = parseInt(userIdStr, 10);
    if (isNaN(userId)) {
        return res.status(400).json({message: 'Invalid User ID'});
    }

    const {content}: CommentRequestBody = req.body;
    // console.log("content:", content)

    console.log(req.params)
    const postId: number = parseInt(req.params.postId, 10);
    // console.log("postId:", postId)
    if (isNaN(postId)) {
        return res.status(400).json({message: 'Invalid post ID'});
    }

    const addCommentQuery = `INSERT INTO comments (userId, content, post_id) VALUES (?, ?, ?)`;

    dbConnection.query(addCommentQuery, [userId, content, postId], (err, results: RowDataPacket[]) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({message: 'Internal server error'});
        }
        return res.status(200).json({message: 'Add content success', data: results});
    });
}
