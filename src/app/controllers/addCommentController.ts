import {Response, Request} from 'express';
import dbConnection from '../../loader/dbConnect';
import {RowDataPacket} from "mysql2";

interface CommentRequestBody {
    comment: string;
}

export const addComment = (req: Request & { userId?: string }, res: Response) => {
    const userIdStr = req.userId;

    if (!userIdStr) {
        return res.status(400).json({message: 'User ID is missing'});
    }

    // Convert userId from string to integer
    const userId = parseInt(userIdStr, 10);
    if (isNaN(userId)) {
        return res.status(400).json({message: 'Invalid User ID'});
    }

    const {comment}: CommentRequestBody = req.body;

    const postId: number = parseInt(req.params.id, 10);
    if (isNaN(postId)) {
        return res.status(400).json({message: 'Invalid post ID'});
    }

    const addCommentQuery = `INSERT INTO comments (userId, comment, postId) VALUES (?, ?, ?)`;

    dbConnection.query(addCommentQuery, [userId, comment, postId], (err, results: RowDataPacket[]) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({message: 'Internal server error'});
        }
        return res.status(200).json({message: 'Add comment success', data: results});
    });
}
