import {check} from 'express-validator';

export const LoginRules = [
    check('email', 'Email must not Empty').notEmpty(),
    check('password', 'Password must not Empty').notEmpty(),
]