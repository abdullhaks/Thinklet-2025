import { Request, Response } from "express";

export default interface IArticleController {
  createArticle(req: Request, res: Response): Promise<void>;
  updateArticleController(req: any, res: any): Promise<void>;
  getPreferenceArticlesController(req: Request, res: Response): Promise<void>;
  getMyArticleController(req: Request, res: Response): Promise<void>;
  deleteArticleController(req: Request, res: Response): Promise<void>;
  getArticleController(req: Request, res: Response): Promise<void>;
  likeArticleController(req: Request, res: Response): Promise<void>;
  dislikeArticleController(req: Request, res: Response): Promise<void>;
}
