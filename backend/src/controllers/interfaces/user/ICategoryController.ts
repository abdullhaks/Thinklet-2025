import { Request, Response } from "express";

export default interface ICategoryController {
  categories(req: Request, res: Response): Promise<void>;
}
