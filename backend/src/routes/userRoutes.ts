import express from "express"
import { accessToken, login, signup } from "../controllers/user/authController";
import { categories } from "../controllers/user/categoryController";

const userRouter = express.Router();


userRouter.post('/signup',signup);
userRouter.post('/login',login);
userRouter.get('/accessToken',accessToken);
userRouter.get('/category',categories);
userRouter.get('/logout',categories);
// userRouter.delete('/article/:id');
// userRouter.patch('/article');


export default userRouter