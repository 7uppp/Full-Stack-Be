import {Response, Request} from 'express';
import queryDatabase from "../../utils/queryDatabase";
import {RowDataPacket} from 'mysql2'
import {validationResult} from "express-validator";

export const fetchLatestTenPosts = async (req: Request, res: Response) => {
    const errors = validationResult(req); //

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    // if(req.params.postId == true){}
    // query database for comments for this post
    const getPostsAndCommentCounts = `
    SELECT 
    p.postId,
    p.post,
    p.userId,
    p.createAt,
    p.userName,
    u.avatarUrl,
    COUNT(c.commentId) AS commentCount
FROM 
    posts p 
LEFT JOIN 
    comments c ON p.postId = c.postId 
JOIN
    userinfo u ON p.userId = u.id  
GROUP BY 
    p.postId, 
    p.post, 
    p.userId, 
    p.createAt, 
    p.userName, 
    u.avatarUrl 
ORDER BY 
    p.createAt DESC 
LIMIT 10;
;`
    try {

        const results: RowDataPacket[] = await queryDatabase(getPostsAndCommentCounts, []);
        if (results.length === 0) {
            return res.status(404).json({message: 'No posts found'});
        }
        console.log(results)
        return res.status(200).json({message: 'Fetch posts success', data: results});
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({message: 'Internal server error', error: error.message});
        } else {
            return res.status(500).json({message: 'Internal server error'});
        }
    }
};