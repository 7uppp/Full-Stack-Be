import {Response, Request} from 'express';
import dbConnection from '../../loader/dbConnect'
import {RowDataPacket} from 'mysql2'
import {validationResult} from "express-validator";

export const fetchAllPosts = async (req: Request, res: Response) => {
    const errors = validationResult(req); //

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    // query database for comments for this post
    const getLatestTenPosts = `SELECT * FROM posts ORDER BY createAt DESC`;

    dbConnection.query(getLatestTenPosts, (err, results: RowDataPacket[]) => {
        if (err) {
            return res.status(500).json({message: 'Internal server error'});
        }

        if (results.length === 0) {
            return res.status(404).json({message: 'No posts found'});
        }
        return res.status(200).json({message: 'Fetch posts success', data: results});


    });

};