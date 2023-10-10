import {Response, Request} from 'express';
import dbConnection from '../../loader/dbConnect';
import {RowDataPacket} from "mysql2";
import {validationResult} from "express-validator";

interface CommentRequestBody {
    comment: string;
}

export const addComment = (req: Request & { userId?: string, username?: string }, res: Response) => {
    const errors = validationResult(req); //

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    //check is
    const postId: number = parseInt(req.params.postId, 10);


    const checkPostExistsQuery = `SELECT * FROM posts WHERE postId = ?`;
    dbConnection.query(checkPostExistsQuery, [postId], (err, results: RowDataPacket[]) => {
            if (err) {
                console.log(err)
                return res.status(500).json({message: 'something wrong'});
            }
            if (results.length === 0) {
                return res.status(404).json({message: 'Post does not exist'});
            }
            if (!req.userId) {
                return res.status(400).json({message: 'User ID is missing'});
            }

            if (!req.username) {
                return res.status(400).json({message: 'User name is missing'});
            }

            const userName = req.username;
            const userId = parseInt(req.userId, 10);

            if (isNaN(userId)) {
                return res.status(400).json({message: 'Invalid User ID'});
            }

            const {comment}: CommentRequestBody = req.body;


            // console.log("content:", content)

            // console.log(req.params)

            // console.log("postId:", postId)
            if (isNaN(postId)) {
                return res.status(400).json({message: 'Invalid post ID'});
            }

            const addCommentQuery = `INSERT INTO comments (userId, comment, postId,userName) VALUES (?, ?, ?,?)`;

            dbConnection.query(addCommentQuery, [userId, comment, postId, userName], (err, results: RowDataPacket[]) => {
                if (err) {
                    console.error("Database Error:", err);
                    return res.status(500).json({message: 'Database Error'});
                }
                return res.status(200).json({message: 'Add content success', data: results});
            });
        }
    );
}
