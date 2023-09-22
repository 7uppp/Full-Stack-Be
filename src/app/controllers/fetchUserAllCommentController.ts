import { Response, Request } from 'express'
import dbConnection from '../../loader/dbConnect'
import {RowDataPacket} from "mysql2";

export const fetchUserAllComment = (req: Request, res: Response) => {
    const { userId } = req.body
    const getUserAllComment = `SELECT * FROM comment WHERE userId = ?`
    dbConnection.query(getUserAllComment, [userId], (err, results: RowDataPacket[]) => {
        if (err) {
            return res.status(500).json({ error: err })
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No comment found' })
        } else {
            return res.status(200).json({ message: 'Fetch comment success', data: results })
        }
    })
}