import { check } from 'express-validator';

export const LoginRules = [
    check('username', 'Username must not Empty').notEmpty(),
]