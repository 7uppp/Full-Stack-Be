import express from 'express';

const router = express.Router();
import * as registerController from '../../controllers/registerController';
import * as registerValidation from "../../Validation/registerRules";
import * as loginController from '../../controllers/loginController';
import * as loginValidation from '../../Validation/loginRules';
import * as commentValidation from '../../Validation/commentRules';
import * as getOnePostValidation from '../../Validation/getOnePost';
import authMiddleware from '../../middleware/authMiddleware';
import * as refreshTokenController from '../../controllers/refreshTokenController';
import * as commentController from '../../controllers/addCommentController';
import * as fetchPostAllCommentController from '../../controllers/fetchPostAllCommentController';


const subRouter = express.Router();

// test subRouter
subRouter.get('/test', (req, res) => {
    return res.status(200).json({message: 'test success'})
})

// router for register
router.post('/register', registerValidation.RegisterRules, registerController.register);

// router for login
router.post('/login', loginValidation.LoginRules, loginController.login);

// router for refresh token
router.post('/refresh-token', refreshTokenController.refreshToken)


//**************All routers which need authMiddleware **************//

//test authMiddleware
router.use('/auth', authMiddleware, subRouter);

//router for add comment for a post
router.post('/posts/:postId/comments', commentValidation.CommentRules, authMiddleware, commentController.addComment);


//router for fetch all comments for a post
router.get('/auth/posts/:postId/comments', getOnePostValidation.GetOnePost, authMiddleware, fetchPostAllCommentController.fetchCommentsForPost);


export default router;