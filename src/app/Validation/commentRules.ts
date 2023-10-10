import {check} from 'express-validator';

export const CommentRules = [
    check('comment', 'Comment must not Empty').notEmpty(),
    check('userId', 'User ID must not Empty').notEmpty(),
    check('postId', 'Post ID must not Empty').notEmpty(),
]