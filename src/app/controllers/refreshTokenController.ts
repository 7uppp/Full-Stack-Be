import {Response, Request} from 'express';
import jwt from 'jsonwebtoken';

export const refreshToken = (req: Request, res: Response) => {
    const refreshToken = req.headers['x-refresh-token'] as string;

    if (!refreshToken) return res.status(401).json({message: 'Refresh token not found'});

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err, decoded) => {
        if (err) return res.status(401).json({message: 'Invalid refresh token'});

        if (!decoded || !(decoded as any).userId) return res.status(401).json({message: 'Invalid token payload'});

        const accessToken = jwt.sign(
            {userId: (decoded as any).userId},
            process.env.ACCESS_TOKEN_SECRET as string,
            {expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN}
        );

        return res.status(200).json({accessToken: accessToken});
    });
};
