import { check } from 'express-validator';

export const RegisterRules = [
check('username').isLength({min:3, max: 50}).withMessage('Username must be between 3 and 20 characters'),
check('email').isEmail().withMessage('Email is not valid'),
check('password').isLength({min:6, max: 20}).withMessage('Password must be between 6 and 20 characters'),
];