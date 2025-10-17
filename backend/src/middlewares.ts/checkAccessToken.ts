import { Request, Response, NextFunction, RequestHandler } from "express";
import { verifyAccessToken } from "../utils/jwt";
import User from "../models/user";
import { HttpStatusCode } from "../utils/enum";

export function verifyAccessTokenMidleware(
  role: "user" | "admin"
): RequestHandler {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (req.path.includes("/accessToken")) return next();

    let token;
    if (role === "user") {
      const { thinklet_accessToken } = req.cookies;

      console.log("thinklet_accessToken is..... ", thinklet_accessToken);

      token = thinklet_accessToken;
      if (!thinklet_accessToken) {
        res
          .status(HttpStatusCode.FORBIDDEN)
          .json({ msg: "Access token missing" });

        return;
      }
    }

    // if (role === "admin") {
    //   const { accessToken } = req.cookies;
    //   console.log("admin token from cookie.......... ", accessToken);
    //   // console.log("token is..... ",accessToken);

    //   token = accessToken;
    //   if (!accessToken) {
    //     res
    //       .status(HttpStatusCode.FORBIDDEN)
    //       .json({ msg: "Access token missing" });
    //     return;
    //   }
    // }

    try {
      const decoded = verifyAccessToken(token);

      console.log("decoded is..... ", decoded);

      if (!decoded) {
        console.log("decoded is not there..... ");

        res
          .status(HttpStatusCode.UNAUTHORIZED)
          .json({ msg: "Access token expired or invalid" });
        return;
      }
      if (decoded.role !== role) {
        console.log("role is not there..... ");

        res
          .status(HttpStatusCode.FORBIDDEN)
          .json({ msg: "Forbidden: Role mismatch" });
        return;
      }

      next();
    } catch (err) {
      console.error("Access token error:", err);
      res
        .status(HttpStatusCode.FORBIDDEN)
        .json({ msg: "Forbidden: Role mismatch" });
      return;
    }
  };
}

export { verifyAccessToken };
