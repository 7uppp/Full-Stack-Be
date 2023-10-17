//to do


// import {Request, Response} from 'express';
// import {validationResult} from "express-validator";
// import {RowDataPacket} from "mysql2/index";
// import queryDatabase from "../../utils/queryDatabase";
//
//
// const GetOnePostInfomation = async (req: Request, res: Response) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({errors: errors.array()});
//     }
//
//     const queryOnePostInformation = `
//             SELECT
//             p.postId,
//             p.post,
//             p.userId,
//             p.createAt,
//             p.userName,
//             COUNT(c.commentId) AS commentCount
//         FROM
//             posts p
//         LEFT JOIN
//             comments c ON p.postId = c.postId `
//     try{
//         const results:RowDataPacket[] = await queryDatabase(,[]);
//     }catch{
//
//     }
// }
//
// export default GetOnePostInfomation;