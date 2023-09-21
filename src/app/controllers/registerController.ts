import { Response, Request } from 'express';
import  dbConnection from "../../loader/dbConnect";
import { RowDataPacket } from 'mysql2';


export const register = async (req: Request, res: Response) => {
    try {
        const { email,username,password } = req.body;
        const checkEmailExist = `SELECT * FROM userinfo WHERE email = ?`;
        dbConnection.query(checkEmailExist, [email], (err,results,fields) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            if ((results as RowDataPacket[]).length > 0) {
                return res.status(409).json({ message: 'Email already exists' });
            }else{
                const registerData = `INSERT INTO userinfo (email,username,password) VALUES (?,?,?)`;
                dbConnection.query(registerData, [email,username,password], (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: err });
                    }
                    res.status(201).json({ message: 'User created' });
                });
            }
        }
        );
    } catch (error) {
        res.status(500).json({ error });
    }
}