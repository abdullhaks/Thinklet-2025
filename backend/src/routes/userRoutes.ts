import express from "express"
import { login, signup } from "../controllers/user/authController";

const userRouter = express.Router();


userRouter.post('/signup',signup);
userRouter.post('/login',login);
// userRouter.get('/articles');
// userRouter.get('/article/:id');
// userRouter.delete('/article/:id');
// userRouter.patch('/article');


export default userRouter