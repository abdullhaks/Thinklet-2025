import express from "express"
import { accessToken, login, logout, signup } from "../controllers/user/authController";
import { categories } from "../controllers/user/categoryController";
import { createArticle, deleteArticleController, dislikeArticleController, getArticleController, getMyArticleController, getPreferenceArticlesController, likeArticleController } from "../controllers/user/articleController";
import { upload } from "../helpers/uploadS3";
import { updateProfileController, updateProfileImageController } from "../controllers/user/profileController";
import { verifyAccessTokenMidleware } from "../middlewares.ts/checkAccessToken";

const userRouter = express.Router();


userRouter.post('/signup',signup);
userRouter.post('/login',login);
userRouter.get('/accessToken',accessToken);
userRouter.get('/category',categories);
userRouter.post('/articleCreate',verifyAccessTokenMidleware("user"),upload.fields([
    { name: "thumbnail", maxCount: 1 },
  ]),createArticle);

userRouter.put('/updateProfileImage',verifyAccessTokenMidleware("user"),upload.fields([
    { name: "profile", maxCount: 1 },
  ]),updateProfileImageController); 
userRouter.put('/updateProfile',verifyAccessTokenMidleware("user"), updateProfileController);
userRouter.get('/article', getArticleController);
userRouter.delete('/article/:id',verifyAccessTokenMidleware("user"),deleteArticleController);
userRouter.post('/logout',logout);
userRouter.get('/preferenceArticles',verifyAccessTokenMidleware("user"),getPreferenceArticlesController);
userRouter.post('/likeArticle',verifyAccessTokenMidleware("user"), likeArticleController);
userRouter.post('/dislikeArticle',verifyAccessTokenMidleware("user"), dislikeArticleController);
userRouter.get('/myArticle',verifyAccessTokenMidleware("user"),getMyArticleController);


// userRouter.patch('/article');


export default userRouter