import {check} from 'express-validator';

export const GetOnePost = [
    check('postId').notEmpty().withMessage('postId must not be empty'),
];