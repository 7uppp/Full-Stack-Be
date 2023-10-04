import {Response, Request} from 'express'
import dbConnection from '../../loader/dbConnect'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {RowDataPacket} from "mysql2";
import {validationResult} from "express-validator";
import config from '../../config';


const ACCESS_TOKEN_LIFETIME = config.ACCESS_TOKEN_EXPIRES_IN
const REFRESH_TOKEN_LIFETIME = config.REFRESH_TOKEN_EXPIRES_IN
export const login = async (req: Request, res: Response) => {
    try {
        //get data from body
        const {email, password} = req.body
        // check if email, password is empty
        const errors = validationResult(req); //

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors});
        }

        //check if user already exists in database
        const getUserData = `SELECT * FROM userinfo WHERE email = ?`
        dbConnection.query(getUserData, [email], async (err, results: RowDataPacket[]) => {
            if (err) {
                return res.status(500).json({error: err})
            }
            if (results.length === 0) {
                return res.status(401).json({message: 'Email does not exist'})
            }

            const hashedPassword = results[0].password
            const username = results[0].username
            // console.log(results)
            const userId = results[0].id
            // console.log(userId)
            const isMatch = await bcrypt.compare(password, hashedPassword)
            if (!isMatch) {
                return res.status(401).json({message: 'Password is incorrect'})
            }
            jwt.sign({userId,username}, config.ACCESS_TOKEN_SECRET as string, {expiresIn: ACCESS_TOKEN_LIFETIME}, (err, accessToken) => {
                if (err) {
                    return res.status(500).json({error: err})
                }
                jwt.sign({userId,username}, config.REFRESH_TOKEN_SECRET as string, {expiresIn: REFRESH_TOKEN_LIFETIME}, (err, refreshToken) => {
                    if (err) {
                        return res.status(500).json({error: err})
                    }
                    return res.status(200).json({
                        msg: 'log in success',
                        username: username,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        userId: userId
                    })
                })
            })
        })
    } catch (error) {
        res.status(500).json({error})
    }
}