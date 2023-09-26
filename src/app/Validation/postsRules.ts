import {check} from 'express-validator';

export const PostRules = [
    check('title', 'Title must not Empty').notEmpty(),
    check('content', 'Content must not Empty').notEmpty(),
]