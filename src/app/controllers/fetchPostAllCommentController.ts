import {Response, Request} from 'express';
import dbConnection from '../../loader/dbConnect';
import {RowDataPacket} from "mysql2";

export const fetchCommentsForPost = (req: Request, res: Response) => {
    // get postId from req.params
    const postId = req.params.postId;
    // console.log("postId:", postId)

    // query database for comments for this post
    const getCommentsForPost = `SELECT * FROM comments WHERE post_id = ?`;

    dbConnection.query(getCommentsForPost, [postId], (err, results: RowDataPacket[]) => {
        if (err) {
            return res.status(500).json({message: 'Internal server error'});
        }

        if (results.length === 0) {
            return res.status(404).json({message: 'No comments found for this post'});
        }

        return res.status(200).json({message: 'Fetch comments success', data: results});
    });
}
