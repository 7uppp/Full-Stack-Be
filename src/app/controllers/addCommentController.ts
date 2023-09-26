import {Response, Request} from 'express';
import dbConnection from '../../loader/dbConnect';
import {RowDataPacket} from "mysql2";
import {validationResult} from "express-validator";

interface CommentRequestBody {
    content: string;
}

export const addComment = (req: Request & { userId?: string }, res: Response) => {
    //check is post exists
    const postId: number = parseInt(req.params.postId, 10);

    const checkPostExistsQuery = `SELECT * FROM posts WHERE post_id = ?`;
    dbConnection.query(checkPostExistsQuery, [postId], (err, results: RowDataPacket[]) => {
            if (err) {
                return res.status(500).json({message: 'Internal server error'});
            }
            if (results.length === 0) {
                return res.status(404).json({message: 'Post does not exist'});
            }
            const userIdStr = req.userId;
            // console.log("userIdStr:", userIdStr)
            const errors = validationResult(req);
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

            // console.log(req.params)

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
    );


}
