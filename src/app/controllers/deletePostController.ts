import {Request, Response} from 'express';
import dbConnection from '../../loader/dbConnect';
import {RowDataPacket} from "mysql2";


export const deletePost = async (req: Request & { userId?: string }, res: Response) => {

    const userId = req.userId;
    const postId = parseInt(req.params.postId, 10);
    const getPostOwnerId = `SELECT userId FROM posts WHERE post_id = ?`;

    dbConnection.query(
        getPostOwnerId,
        [postId],
        async (err, results: RowDataPacket[]) => {
            if (err) {
                return res.status(500).json({error: err});
            }

            if (results.length === 0) {
                return res.status(404).json({message: 'No post found'});
            }
            // console.log("results:", results)
            const postOwnerId = results[0]?.userId;

            // console.log("postOwnerId:", postOwnerId)
            // console.log("userId:", userId)

            if (userId !== postOwnerId) {
                return res.status(401).json({message: 'You are not the owner of this post'});
            }

            const deletePostQuery = `DELETE FROM posts WHERE post_id = ?`;
            dbConnection.query(deletePostQuery, [postId], (err, results: RowDataPacket[]) => {
                    if (err) {
                        console.error("Database Error:", err);
                        return res.status(500).json({message: 'Internal server error'});
                    }
                    return res.status(200).json({message: 'Delete post success', data: results});
                }
            );
        });


}