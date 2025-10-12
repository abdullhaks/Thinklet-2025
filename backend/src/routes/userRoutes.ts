import express from "express"
import { accessToken, login, logout, signup } from "../controllers/user/authController";
import { categories } from "../controllers/user/categoryController";
import { createArticle, getPreferenceArticlesController } from "../controllers/user/articleController";
import { upload } from "../helpers/uploadS3";

const userRouter = express.Router();


userRouter.post('/signup',signup);
userRouter.post('/login',login);
userRouter.get('/accessToken',accessToken);
userRouter.get('/category',categories);
userRouter.post('/articleCreate',upload.fields([
    { name: "thumbnail", maxCount: 1 },
  ]),createArticle);
userRouter.put('/article',categories);
userRouter.get('/logout',logout);
userRouter.get('/preferenceArticles',getPreferenceArticlesController);

// userRouter.delete('/article/:id');
// userRouter.patch('/article');


export default userRouter