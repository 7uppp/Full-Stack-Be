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
import * as createPostController from '../../controllers/createPostController';
import * as createPostValidation from '../../Validation/postsRules';
import * as deletePostController from '../../controllers/deletePostController';

const subRouter = express.Router();

//**************All routers which don't need authMiddleware **************//
// router for register
router.post('/register', registerValidation.RegisterRules, registerController.register);

// router for login
router.post('/login', loginValidation.LoginRules, loginController.login);

// router for refresh token
router.post('/refresh-token', refreshTokenController.refreshToken)


//**************All routers which need authMiddleware **************//

router.use('/auth', authMiddleware, subRouter);

subRouter.post('/posts', createPostValidation.PostRules, createPostController.createPostController);

//router for add comment for a post
subRouter.post('/posts/:postId/comments', commentValidation.CommentRules, commentController.addComment);

//router for fetch all comments for a post
subRouter.get('/posts/:postId/comments', getOnePostValidation.GetOnePost, fetchPostAllCommentController.fetchCommentsForPost);

//router for delete one comment
subRouter.delete('/comments/:commentId/', deletePostController.deletePost);


export default router;