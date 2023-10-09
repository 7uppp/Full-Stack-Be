import express from 'express';

const router = express.Router();
const subRouter = express.Router();
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
import * as deleteCommentController from '../../controllers/deleteCommentController';
import * as deletePostController from '../../controllers/deletePostController';
import * as fetchLatestTenPostsController from '../../controllers/fetchLatestTenPostsController';
import * as getUserInfoController from '../../controllers/getUserInfoController';


//**************All routers which don't need authMiddleware **************//
// router for register
router.post('/register', registerValidation.RegisterRules, registerController.register);

// router for login
router.post('/login', loginValidation.LoginRules, loginController.login);

//router for fetch latest 10 posts
router.get('/posts', fetchLatestTenPostsController.fetchLatestTenPosts);

// router for refresh token
router.post('/refreshToken', refreshTokenController.refreshToken);

router.post('/getUserInfo', getUserInfoController.getUserInfo);
//**************All routers which need authMiddleware **************//

router.use('/auth', authMiddleware, subRouter);

//router for create post
subRouter.post('/posts', createPostValidation.PostRules, createPostController.createPostController);

//router for add comment for a post
subRouter.post('/posts/:postId/comments', commentValidation.CommentRules, commentController.addComment);



//router for fetch all comments for a post
subRouter.get('/posts/:postId/comments', getOnePostValidation.GetOnePost, fetchPostAllCommentController.fetchCommentsForPost);

//router for delete one comment
subRouter.delete('/comments/:commentId/', deleteCommentController.deleteComment);

//router for delete one post
subRouter.delete('/posts/:postId/', deletePostController.deletePost);


export default router;