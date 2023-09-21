import express from 'express';
const router = express.Router();
import * as registerController from '../../controllers/registerController';
import * as registerValidation from "../../Validation/registerRules";


router.post('/register', registerValidation.RegisterRules, registerController.register);


router.get('/login',
);

export default router;