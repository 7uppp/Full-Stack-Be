import { check } from 'express-validator';

export const RegisterRules = [
    check('username')
        .isLength({ min: 3, max: 20 })
        .notEmpty()
        .isAlphanumeric()
        .withMessage('3-20 characters, only letters and numbers'),

    check('email').isEmail().withMessage('Email is not valid'),

    check('password')
        .isLength({ min: 8, max: 16 })
        .matches(/[a-z]/)
        .matches(/[A-Z]/)
        .matches(/\d/)
        .withMessage('Password need 8-16 characters, at least one upper & lowercase & a number'),
];