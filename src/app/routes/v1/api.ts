import express from 'express';
const router = express.Router();
import * as registerController from '../../controllers/registerController';
import * as registerValidation from "../../Validation/registerRules";
import * as refreshToken from "../../controllers/refreshToken";


router.post('/register', registerValidation.RegisterRules, registerController.register);


router.get('/login',
);

router.post('/refresh-token', refreshToken.refreshTokenEndpoint)
export default router;