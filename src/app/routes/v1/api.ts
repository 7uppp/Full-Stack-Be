import express from 'express';

const router = express.Router();
import * as registerController from '../../controllers/registerController';
import * as registerValidation from "../../Validation/registerRules";
import * as loginController from '../../controllers/loginController';
import * as loginValidation from '../../Validation/loginRules';
import authMiddleware from "../../middleware/authMiddleware";
import * as refreshTokenController from "../../controllers/refreshTokenController";

const subRouter = express.Router();

// test subRouter
subRouter.get('/test', (req, res) => {
    return res.status(200).json({message: 'test success'})
})
router.post('/register', registerValidation.RegisterRules, registerController.register);

router.post('/login', loginValidation.LoginRules, loginController.login);

router.post('/refresh-token', refreshTokenController.refreshToken)


//**************All routers which need authMiddleware **************//
router.use('/auth', authMiddleware, subRouter);

export default router;