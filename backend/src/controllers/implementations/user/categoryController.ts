import { Request, Response } from "express";

import { HttpStatusCode } from "../../../utils/enum";
import { MESSAGES } from "../../../utils/messages";
import ICategoryController from "../../interfaces/user/ICategoryController";
import { inject, injectable } from "inversify";
import ICategoryService from "../../../services/interfaces/user/ICategoryService";

@injectable()
export default class CategoryController implements ICategoryController {
  constructor(
    @inject("ICategoryService") private _categoryService: ICategoryService
  ) {}

  async categories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this._categoryService.getCategories();

      console.log("user is ", categories);

      res.status(HttpStatusCode.OK).json(categories);
    } catch (error: any) {
      console.error("Error in signup:", error);
      res.status(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: error.message || MESSAGES.server.serverError,
        code: error.code || "SERVER_ERROR",
      });
    }
  }
}
