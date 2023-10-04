import {Response, Request} from 'express';
import jwt from 'jsonwebtoken';
import {validationResult} from "express-validator";
import config from '../../config';

export const refreshToken = (req: Request, res: Response) => {
    console.log(req.headers)
    const refreshToken = req.headers.refreshtoken as string;
    const errors = validationResult(req); //

    console.log(refreshToken)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    //check if refreshToken is exit
    if (!refreshToken) return res.status(401).json({message: 'Refresh token not found'});

    //check if refreshToken is valid
    jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET as string, (err, decoded) => {
        if (err) return res.status(401).json({message: 'Invalid refresh token'});

        if (!decoded || !(decoded as any).userId) return res.status(401).json({message: 'Invalid token payload'});

        //create new accessToken
        const accessToken = jwt.sign(
            {userId: (decoded as any).userId,username: (decoded as any).username},
            config.ACCESS_TOKEN_SECRET as string,
            {expiresIn: config.ACCESS_TOKEN_EXPIRES_IN}
        );

        return res.status(200).json({accessToken: accessToken});
    });
};
