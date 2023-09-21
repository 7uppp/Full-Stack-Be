import { Response, Request } from 'express'
import dbConnection from '../../loader/dbConnect'
import { RowDataPacket } from 'mysql2'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string
const ACCESS_TOKEN_LIFETIME = '1h'
const REFRESH_TOKEN_LIFETIME = '7d'
const SALT_ROUNDS = 10 //

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body
    if (!email || !username || !password) {
      return res.status(400).json({
        message: 'Please provide all fields',
      })
    }

    const checkEmailExist = `SELECT * FROM userinfo WHERE email = ?`
    dbConnection.query(
      checkEmailExist,
      [email],
      async (err, results: RowDataPacket[]) => {
        if (err) {
          return res.status(500).json({ error: err })
        }
        if (results.length > 0) {
          return res.status(409).json({ message: 'Email already exists' })
        } else {
          const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

          const registerData = `INSERT INTO userinfo (email, username, password) VALUES (?, ?, ?)`
          dbConnection.query(
            registerData,
            [email, username, hashedPassword],
            (err, result: any) => {
              if (err) {
                return res.status(500).json({ error: err })
              }
              const userId = result.insertId
              const accessToken = jwt.sign(
                { userId, email },
                ACCESS_TOKEN_SECRET,
                {
                  expiresIn: ACCESS_TOKEN_LIFETIME,
                }
              )
              const refreshToken = jwt.sign(
                { userId, email },
                REFRESH_TOKEN_SECRET,
                {
                  expiresIn: REFRESH_TOKEN_LIFETIME,
                }
              )

              const saveRefreshToken = `INSERT INTO refreshtoken (token, id) VALUES (?, ?)`
              dbConnection.query(
                saveRefreshToken,
                [refreshToken, userId],
                (err) => {
                  if (err) {
                    return res.status(500).json({ err })
                  }
                  res.status(201).json({
                    message: 'User created',
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                  })
                }
              )
            }
          )
        }
      }
    )
  } catch (error) {
    res.status(500).json({ error })
  }
}
