import { Response, Request } from 'express'
import dbConnection from '../../loader/dbConnect'
import { RowDataPacket } from 'mysql2'
import jwt from 'jsonwebtoken'

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN as string

export const refreshTokenEndpoint = (req: Request, res: Response) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' })
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid refresh token' })
    }

    const checkTokenExist = `SELECT * FROM refreshtoken WHERE token = ?`
    dbConnection.query(
      checkTokenExist,
      [refreshToken],
      (err, results: RowDataPacket[]) => {
        if (err || results.length === 0) {
          return res.status(403).json({ message: 'Refresh token not found' })
        }

        const { userId, email } = decoded as any
        const newAccessToken = jwt.sign(
          { userId, email },
          ACCESS_TOKEN_SECRET,
          {
            expiresIn: ACCESS_TOKEN_EXPIRES_IN,
          }
        )

        res.json({ accessToken: newAccessToken })
      }
    )
  })
}
