import {check} from 'express-validator';

export const CommentRules = [
    check('comment', 'Comment must not Empty').notEmpty(),
    check('useId', 'User ID must not Empty').notEmpty(),
]