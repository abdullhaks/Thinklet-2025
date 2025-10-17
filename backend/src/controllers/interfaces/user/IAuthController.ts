import { Request, Response } from "express";

export default interface IAuthController {
  signup(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  accessToken(req: Request, res: Response): Promise<void>;
}
