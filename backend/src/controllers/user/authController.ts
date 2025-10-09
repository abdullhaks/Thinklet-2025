import { Request, Response } from 'express';
import { loginUser, signupUser, } from '../../services/user/authService';
import { HttpStatusCode } from '../../utils/enum';
import { MESSAGES } from '../../utils/messages';

export const signup = async (
    req: Request,
    res: Response,
  ): Promise<void> =>{
    try {
      const { firstName,lastName, email, password, confirmPassword, phone, preferences } = req.body;

      const userDetails = { firstName,lastName, email, password, confirmPassword, phone, preferences };

      console.log("user details is ", userDetails);

      const user = await signupUser(userDetails);

      console.log("user  is ", user);

      res.status(HttpStatusCode.CREATED).json(user);

    } catch (error) {
      console.log(error);
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: MESSAGES.server.serverError });
    }
  }


export const login =  async (req: Request, res: Response): Promise<void> =>{
    try {
      const {emailOrPhone,password} = req.body;

      console.log("loginDTO...........", emailOrPhone,password);
      const result = await loginUser({emailOrPhone,password})

      console.log("result is ", result);

      if (!result) {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ msg: "Envalid credentials" });
        return;
      }

   
      res.cookie("thinklet_refreshToken", result.refreshToken, {
        httpOnly: true,
        sameSite: "none", // allow cross-site
        secure: true, // only over HTTPS
        maxAge: parseInt(process.env.MAX_AGE || "604800000"),
      });

      res.cookie("thinklet_accessToken", result.accessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: parseInt(process.env.MAX_AGE || "604800000"),
      });

      res
        .status(HttpStatusCode.OK)
        .json({ message: result.message, user: result.user });
    } catch (error) {
      console.log(error);
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: MESSAGES.server.serverError });
    }
  }


export const logout =   async (req: Request, res: Response): Promise<void> =>{
    try {
      console.log("log out ............ ctrl....");
      res.clearCookie("thinklet_refreshToken", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      res.clearCookie("thinklet_accessToken", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });


      res
        .status(HttpStatusCode.OK)
        .json({ message:"logout successfully"});
    } catch (error) {
      console.log(error);
    }

    
  }