import {Request, Response} from 'express';
import dbConnection from '../../loader/dbConnect';
import {RowDataPacket} from "mysql2";


interface RequestWithUserId extends Request {
    userId?: string;
}

export const deleteComment = async (req: RequestWithUserId, res: Response) => {

    const userId = req.userId; // userId is attached to req object by authMiddleware
    const commentId = parseInt(req.params.commentId, 10);
    const getCommentOwnerId = `SELECT userId FROM comments WHERE commentId = ?`;

    dbConnection.query(
        getCommentOwnerId,
        [commentId],
        async (err, results: RowDataPacket[]) => {
            if (err) {
                return res.status(500).json({error: err});
            }

            if (results.length === 0) {
                return res.status(404).json({message: 'No comment found'});
            }
            // console.log("results:", results)
            const commentOwnerId = results[0]?.userId;



            if (userId !== commentOwnerId) {
                return res.status(401).json({message: 'You are not the owner of this post'});
            }
            const deletePostQuery = `DELETE FROM comments WHERE commentId = ?`;

            dbConnection.query(deletePostQuery, [commentId], (err, results: RowDataPacket[]) => {
                if (err) {
                    console.error("Database Error:", err);
                    return res.status(500).json({message: 'Internal server error'});
                }
                return res.status(200).json({message: 'Delete post success', data: results});
            });
        }
    );


}