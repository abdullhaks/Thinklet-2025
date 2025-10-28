import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { HttpStatusCode } from "../../../utils/enum";
import { MESSAGES } from "../../../utils/messages";
import { IPreference } from "../../../dto/userDto";
import IArticleController from "../../interfaces/user/IArticleController";
import IArticleService from "../../../services/interfaces/user/IArticleService";
import { verifyRefreshToken } from "../../../utils/jwt";

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

type MulterFiles = {
  [fieldname: string]: MulterFile[];
};

@injectable()
export default class ArticleController implements IArticleController {
  constructor(
    @inject("IArticleService") private _articleService: IArticleService
  ) {
    console.log(
      "ArticleService constructor - _articleRepository:",
      !!this._articleService
    );
  }

  async createArticle(req: Request, res: Response): Promise<void> {
    console.log("herere.e.e...e. bakend.....");

    try {
      const { title, description, category, tags, author } = req.body;

      const articleDetail = { title, description, category, tags, author };

      console.log("articleDetail  is ", articleDetail);

      const thumbnailFile = (req.files as MulterFiles)?.thumbnail?.[0];

      const thumbnail = thumbnailFile
        ? {
            buffer: thumbnailFile.buffer,
            originalname: thumbnailFile.originalname,
            mimetype: thumbnailFile.mimetype,
          }
        : undefined;

      const response = await this._articleService.articleCreate(
        articleDetail,
        thumbnail
      );

      res.status(HttpStatusCode.CREATED).json(response.article);
    } catch (error: any) {
      console.error("Error create article :", error);
      res.status(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: error.message || MESSAGES.server.serverError,
        code: error.code || "SERVER_ERROR",
      });
    }
  }

  async updateArticleController(req: any, res: any): Promise<void> {
    try {
      const { articleId, title, description, category, tags, author } =
        req.body;
      if (!articleId || !title || !description || !category || !author) {
        return res
          .status(400)
          .json({ message: "Missing required fields", code: "MISSING_FIELDS" });
      }

      const thumbnailFile = (req.files as MulterFiles)?.thumbnail?.[0];
      let thumbnail:
        | string
        | { buffer: Buffer; originalname: string; mimetype: string }
        | undefined = undefined;

      if (thumbnailFile) {
        thumbnail = {
          buffer: thumbnailFile.buffer,
          originalname: thumbnailFile.originalname,
          mimetype: thumbnailFile.mimetype,
        };
      } else if ("thumbnail" in req.body) {
        thumbnail = req.body.thumbnail;
      }

      const articleData = {
        _id: articleId,
        title,
        description,
        category,
        tags: tags ? tags.split(",").map((tag: string) => tag.trim()) : [],
        author,
        thumbnail,
      };

      const response = await this._articleService.updateArticleService(
        articleData
      );
      return res
        .status(200)
        .json({
          message: "Article updated successfully",
          article: response.article,
        });
    } catch (error: any) {
      console.error("Error in updating article:", error);
      return res.status(error.status || 500).json({
        message: error.message || "Internal server error",
        code: error.code || "SERVER_ERROR",
      });
    }
  }

  async getPreferenceArticlesController(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { all, preferences, userId, limit = 5, articleSet = 1 } = req.query;


      // Validate preferences
      if (
        !userId ||
        !preferences ||
        !Array.isArray(JSON.parse(preferences as string))
      ) {
        throw {
          status: HttpStatusCode.BAD_REQUEST,
          message: "Preferences must be provided as an array",
          code: "INVALID_PREFERENCES",
        };
      }

      const parsedPreferences: IPreference[] = JSON.parse(
        preferences as string
      );
      const parsedLimit = parseInt(limit as string, 10);
      const parsedArticleSet = parseInt(articleSet as string, 10);

      if (
        isNaN(parsedLimit) ||
        isNaN(parsedArticleSet) ||
        parsedLimit <= 0 ||
        parsedArticleSet <= 0
      ) {
        throw {
          status: HttpStatusCode.BAD_REQUEST,
          message: "Invalid limit or articleSet",
          code: "INVALID_PAGINATION",
        };
      }

      const response = await this._articleService.getPreferenceArticlesService(
        all === 'true',
        parsedPreferences,
        parsedLimit,
        parsedArticleSet,
        userId.toString()
      );

      res.status(HttpStatusCode.OK).json({
        message: MESSAGES.user.articlesFetched,
        articles: response.articles,
      });
    } catch (error: any) {
      console.error("Error in getPreferenceArticlesController:", error);
      res.status(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: error.message || MESSAGES.server.serverError,
        code: error.code || "SERVER_ERROR",
      });
    }
  }



async getSearchedArticlesController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { query, userId, limit = 5, articleSet = 1 } = req.query;

    if (!userId || !query || typeof query !== 'string' || query.trim() === '') {
      throw {
        status: HttpStatusCode.BAD_REQUEST,
        message: "Valid search query must be provided",
        code: "INVALID_QUERY",
      };
    }

    const parsedLimit = parseInt(limit as string, 10);
    const parsedArticleSet = parseInt(articleSet as string, 10);

    if (
      isNaN(parsedLimit) ||
      isNaN(parsedArticleSet) ||
      parsedLimit <= 0 ||
      parsedArticleSet <= 0
    ) {
      throw {
        status: HttpStatusCode.BAD_REQUEST,
        message: "Invalid limit or articleSet",
        code: "INVALID_PAGINATION",
      };
    }

    const response = await this._articleService.getSearchedArticlesService(
      query.toString().trim(),
      parsedLimit,
      parsedArticleSet,
      userId.toString()
    );

    res.status(HttpStatusCode.OK).json({
      message: MESSAGES.user.articlesFetched,
      articles: response.articles,
    });
  } catch (error: any) {
    console.error("Error in getSearchedArticlesController:", error);
    res.status(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error.message || MESSAGES.server.serverError,
      code: error.code || "SERVER_ERROR",
    });
  }
}

  async getMyArticleController(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.query;
      console.log("userId...", userId);

      // Validate preferences
      if (!userId) {
        throw {
          status: HttpStatusCode.BAD_REQUEST,
          message: "fetching atricles failed",
          code: "INVALID_PREFERENCES",
        };
      }
      // const parsedLimit = parseInt(limit as string, 10);
      // const parsedArticleSet = parseInt(articleSet as string, 10);

      const response = await this._articleService.getMyArticleService(
        userId.toString()
      );

      console.log("my articles are ", response.articles);

      res.status(HttpStatusCode.OK).json({
        message: MESSAGES.user.articlesFetched,
        articles: response.articles,
      });
    } catch (error: any) {
      console.error("Error in getPreferenceArticlesController:", error);
      res.status(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: error.message || MESSAGES.server.serverError,
        code: error.code || "SERVER_ERROR",
      });
    }
  }

  async deleteArticleController(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        throw {
          status: HttpStatusCode.BAD_REQUEST,
          message: "Article ID is required",
          code: "MISSING_ARTICLE_ID",
        };
      }
      const response = await this._articleService.deleteArticleService(id);

      res.status(HttpStatusCode.OK).json({
        message: MESSAGES.user.articleDeleted,
      });
    } catch (error: any) {
      console.error("Error in deleteArticleController:", error);
      res.status(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: error.message || MESSAGES.server.serverError,
        code: error.code || "SERVER_ERROR",
      });
    }
  }

  async getArticleController(req: Request, res: Response): Promise<void> {
    try {
      const { articleId } = req.query;

      const { thinklet_refreshToken } = req.cookies;
            
                  if (!thinklet_refreshToken) {
                    res
                      .status(HttpStatusCode.FORBIDDEN)
                      .json({ msg: "refresh token not found" });
                    return;
                  }
      
      const authDetails = verifyRefreshToken(thinklet_refreshToken);

      if (!articleId || typeof articleId !== "string") {
        throw {
          status: HttpStatusCode.BAD_REQUEST,
          message: "Article ID is required and must be a string",
          code: "MISSING_ARTICLE_ID",
        };
      }

     

      const response = await this._articleService.getArticleService(
        articleId,
        authDetails?.id as string | undefined
      );

      console.log("Article fetched in controller......////:", response);

      res.status(HttpStatusCode.OK).json({ article: response });
    } catch (error: any) {
      console.error("Error in getArticleController:", error);
      res.status(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: error.message || MESSAGES.server.serverError,
        code: error.code || "SERVER_ERROR",
      });
    }
  }

  async likeArticleController(req: Request, res: Response): Promise<void> {
    try {
      const { articleId } = req.body;

      const { thinklet_refreshToken } = req.cookies;
            
                  if (!thinklet_refreshToken) {
                    res
                      .status(HttpStatusCode.FORBIDDEN)
                      .json({ msg: "refresh token not found" });
                    return;
                  }
      
      const authDetails = verifyRefreshToken(thinklet_refreshToken);
      if(!authDetails) {
        res.status(HttpStatusCode.FORBIDDEN)
            .json({ msg: "refresh token not found" });
            return;
      }

      if (!articleId) {
        throw {
          status: HttpStatusCode.BAD_REQUEST,
          message: "Article ID and user ID are required",
          code: "MISSING_FIELDS",
        };
      }

      const response = await this._articleService.likeArticleService(
        articleId,
        authDetails.id
      );

      res.status(HttpStatusCode.OK).json({
        message: MESSAGES.user.likeSuccess,
        liked: response.liked,
        likesCount: response.likesCount,
        dislikesCount: response.dislikesCount,
      });
    } catch (error: any) {
      console.error("Error in likeArticleController:", error);
      res.status(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: error.message || MESSAGES.server.serverError,
        code: error.code || "SERVER_ERROR",
      });
    }
  }

  async dislikeArticleController(req: Request, res: Response): Promise<void> {
    try {
      const { articleId } = req.body;

        const { thinklet_refreshToken } = req.cookies;
            
                  if (!thinklet_refreshToken) {
                    res
                      .status(HttpStatusCode.FORBIDDEN)
                      .json({ msg: "refresh token not found" });
                    return;
                  }
      
      const authDetails = verifyRefreshToken(thinklet_refreshToken);
      if(!authDetails) {
        res.status(HttpStatusCode.FORBIDDEN)
            .json({ msg: "refresh token not found" });
            return;
      }

      if (!articleId) {
        throw {
          status: HttpStatusCode.BAD_REQUEST,
          message: "Article ID and user ID are required",
          code: "MISSING_FIELDS",
        };
      }

      const response = await this._articleService.dislikeArticleService(
        articleId,
        authDetails.id
      );

      res.status(HttpStatusCode.OK).json({
        message: MESSAGES.user.dislikeSuccess,
        disliked: response.disliked,
        likesCount: response.likesCount,
        dislikesCount: response.dislikesCount,
      });
    } catch (error: any) {
      console.error("Error in dislikeArticleController:", error);
      res.status(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: error.message || MESSAGES.server.serverError,
        code: error.code || "SERVER_ERROR",
      });
    }
  }
}
