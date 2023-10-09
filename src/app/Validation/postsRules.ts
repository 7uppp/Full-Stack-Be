import {check} from 'express-validator';

export const PostRules = [
    check('post', 'Content must not Empty').notEmpty(),
]