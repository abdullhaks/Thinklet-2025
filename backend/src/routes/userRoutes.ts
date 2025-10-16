import express from "express"
import { accessToken, login, logout, signup } from "../controllers/implementations/user/authController";
import { categories } from "../controllers/implementations/user/categoryController";

import { upload } from "../helpers/uploadS3";
import { updateProfileController, updateProfileImageController } from "../controllers/implementations/user/profileController";
import { verifyAccessTokenMidleware } from "../middlewares.ts/checkAccessToken";
import container from "../config/inversify"
import IArticleController from "../controllers/interfaces/user/IArticleController";

const userRouter = express.Router();

const articleController = container.get<IArticleController>("IArticleController");

userRouter.post('/signup',signup);
userRouter.post('/login',login);
userRouter.get('/accessToken',accessToken);
userRouter.get('/category',categories);
userRouter.post('/articleCreate',verifyAccessTokenMidleware("user"),upload.fields([
    { name: "thumbnail", maxCount: 1 },
  ]),(req,res)=>articleController.createArticle(req,res));

userRouter.put('/updateProfileImage',verifyAccessTokenMidleware("user"),upload.fields([
    { name: "profile", maxCount: 1 },
  ]),updateProfileImageController); 
userRouter.put('/updateProfile',verifyAccessTokenMidleware("user"), updateProfileController);
userRouter.get('/article', (req,res)=>articleController.getArticleController(req,res));
userRouter.delete('/article/:id',verifyAccessTokenMidleware("user"),articleController.deleteArticleController);
userRouter.post('/logout',logout);
userRouter.get('/preferenceArticles',verifyAccessTokenMidleware("user"),(req,res)=>articleController.getPreferenceArticlesController(req,res));
userRouter.post('/likeArticle',verifyAccessTokenMidleware("user"), (req,res)=>articleController.likeArticleController(req,res));
userRouter.post('/dislikeArticle',verifyAccessTokenMidleware("user"), (req,res)=>articleController.dislikeArticleController(req,res));
userRouter.get('/myArticle',verifyAccessTokenMidleware("user"),(req,res)=>articleController.getMyArticleController(req,res));


// userRouter.patch('/article');


export default userRouter