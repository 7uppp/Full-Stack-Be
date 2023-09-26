import {check} from 'express-validator';

export const GetOnePost = [
    check('PostId').notEmpty().withMessage('PostId must not be empty'),
];