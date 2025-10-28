import { Request, Response } from "express";
import { HttpStatusCode } from "../../../utils/enum";
import { MESSAGES } from "../../../utils/messages";
import { inject, injectable } from "inversify";
import IAuthController from "../../interfaces/user/IAuthController";
import IAuthService from "../../../services/interfaces/user/IAuthService";

@injectable()
export default class AuthController implements IAuthController {
  constructor(@inject("IAuthService") private _authService: IAuthService) {}

  async signup(req: Request, res: Response): Promise<void> {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        phone,
        preferences,
      } = req.body;

      const userDetails = {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        phone,
        preferences,
      };

      console.log("user details is ", userDetails);

      const response = await this._authService.signupUser(userDetails);

      console.log("user is ", response.user);
      res.cookie("thinklet_refreshToken", response.refreshToken, {
        httpOnly: true,
        sameSite: "none", // allow cross-site
        secure: true, // only over HTTPS
        maxAge: parseInt(process.env.MAX_AGE || "604800000"),
      });

      res.cookie("thinklet_accessToken", response.accessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: parseInt(process.env.MAX_AGE || "604800000"),
      });

      res.status(HttpStatusCode.CREATED).json(response.user);
    } catch (error: any) {
      console.error("Error in signup:", error);
      res.status(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: error.message || MESSAGES.server.serverError,
        code: error.code || "SERVER_ERROR",
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { emailOrPhone, password } = req.body;

      if (!emailOrPhone || !password) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          message: "Please provide all required fields",
          code: "MISSING_FIELDS",
        });
        return;
      }

      const result = await this._authService.loginUser({
        emailOrPhone,
        password,
      });

      res.cookie("thinklet_refreshToken", result.refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
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
    } catch (error: any) {
      console.error("Error in login:", error);
      res.status(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: error.message || MESSAGES.server.serverError,
        code: error.code || "SERVER_ERROR",
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
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

      res.status(HttpStatusCode.OK).json({ message: "logout successfully" });
    } catch (error) {
      console.log(error);
    }
  }

  async accessToken(req: Request, res: Response): Promise<void> {
    try {
      const { thinklet_refreshToken } = req.cookies;

      if (!thinklet_refreshToken) {
        res
          .status(HttpStatusCode.FORBIDDEN)
          .json({ msg: "refresh token not found" });
        return;
      }

      const result = await this._authService.getAccessToken(
        thinklet_refreshToken
      );

      console.log("result from ctrl is ...", result);

      if (!result) {
        res
          .status(HttpStatusCode.UNAUTHORIZED)
          .json({ msg: "Refresh token expired" });
        return;
      }

      const { accessToken } = result;

      console.log("result from ctrl is afrt destructr...", accessToken);

      res.cookie("thinklet_accessToken", accessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: parseInt(process.env.MAX_AGE || "604800000"),
      });

      res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      console.log(error);
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: MESSAGES.server.serverError });
    }
  }
}
