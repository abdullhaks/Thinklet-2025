import { uploadFileToS3 } from "../../../helpers/uploadS3";
import { HttpStatusCode } from "../../../utils/enum";
import { ArticleResponseDTO, articleUpdateRequestDTO, IArticleData } from "../../../dto/articleDto";
import { IPreference } from "../../../dto/userDto";
import { inject, injectable } from "inversify";
import IArticleService from "../../interfaces/user/IArticleService";
import IArticleRepository from "../../../repositories/interfaces/IArticleRepository";
import IInteractionRepository from "../../../repositories/interfaces/IInteractionRepository";
import ICategoryRepository from "../../../repositories/interfaces/IcategoryRepository";
import { Types } from "mongoose";

interface IThumbnail {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

interface aggregationResult {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    profile?: string;
  };
  category: {
    _id: string;
    name: string;
  };
}

@injectable()
export default class ArticleService implements IArticleService {
  constructor(
    @inject("IArticleRepository")
    private _articleRepository: IArticleRepository,
    @inject("IInteractionRepository")
    private _interactionRepository: IInteractionRepository,
    @inject("ICategoryRepository")
    private _categoryRepository: ICategoryRepository
  ) {
    console.log(
      "ArticleService constructor - _articleRepository:",
      !!this._articleRepository
    );
  }

  async getArticleResponse(
    articleId: string,
    userId?: string
  ): Promise<ArticleResponseDTO> {
    try {
      // Validate articleId
      if (!articleId) {
        throw {
          status: HttpStatusCode.BAD_REQUEST,
          message: "Article ID is required",
          code: "MISSING_ARTICLE_ID",
        };
      }

      // Fetch article with populated references
      const article = await this._articleRepository.getArticle(articleId);

      if (!article) {
        throw {
          status: HttpStatusCode.NOT_FOUND,
          message: "Article not found",
          code: "ARTICLE_NOT_FOUND",
        };
      }

      const typedArticle: aggregationResult = JSON.parse(
        JSON.stringify(article)
      );

      // Aggregate likes/dislikes count
      const [likesCount, dislikesCount] = await Promise.all([
        this._interactionRepository.countDocuments({
          article: articleId,
          like: true,
        }),
        this._interactionRepository.countDocuments({
          article: articleId,
          dislike: true,
        }),
      ]);

      // Get user’s interaction if userId is provided
      let userInteraction = {
        liked: false,
        disliked: false,
        blocked: false,
      };

      if (userId) {
        const interaction = await this._interactionRepository.findOne({
          article: articleId,
          user: userId,
        });

        if (interaction) {
          userInteraction = {
            liked: interaction.like || false,
            disliked: interaction.dislike || false,
            blocked: interaction.block || false,
          };
        }
      }

      // Construct response
      const response: ArticleResponseDTO = {
        _id: typedArticle._id.toString(),
        title: typedArticle.title,
        description: typedArticle.description,
        thumbnail: typedArticle.thumbnail || null,
        tags: typedArticle.tags || [],
        category: {
          _id: typedArticle.category._id.toString(),
          name: typedArticle.category.name,
        },
        author: {
          _id: typedArticle.author._id.toString(),
          firstName: typedArticle.author.firstName,
          lastName: typedArticle.author.lastName,
          profile: typedArticle.author.profile || undefined,
        },
        likesCount,
        dislikesCount,
        userInteraction,
        createdAt: typedArticle.createdAt,
        updatedAt: typedArticle.updatedAt,
      };

      return response;
    } catch (error: any) {
      throw {
        status: error.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: error.message || "Failed to fetch article",
        code: error.code || "FETCH_ARTICLE_ERROR",
      };
    }
  }

  async articleCreate(
    articleData: Partial<IArticleData>,
    thumbnail?: IThumbnail
  ): Promise<{ message: string; article: ArticleResponseDTO }> {
    try {
      // Validate required fields
      if (
        !articleData.title ||
        !articleData.description ||
        !articleData.category ||
        !articleData.author
      ) {
        throw {
          status: HttpStatusCode.BAD_REQUEST,
          message:
            "Please provide all required fields (title, description, category, author)",
          code: "MISSING_FIELDS",
        };
      }

      // Validate category
      const categoryExists = await this._categoryRepository.findOne({
        _id: articleData.category,
      });

      if (!categoryExists) {
        throw {
          status: HttpStatusCode.BAD_REQUEST,
          message: "Invalid category",
          code: "INVALID_CATEGORY",
        };
      }

      // Handle thumbnail upload
      let thumbnailUrl: string | undefined;
      if (thumbnail) {
        const uploadResult = await uploadFileToS3(
          thumbnail.buffer,
          thumbnail.originalname,
          "thinklet_thumbnails",
          thumbnail.mimetype
        );
        if (!uploadResult?.fileUrl) {
          throw {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: "Failed to upload thumbnail",
            code: "THUMBNAIL_UPLOAD_FAILED",
          };
        }
        thumbnailUrl = uploadResult.fileUrl;
      }

      // Create new article
      const newArticle = {
        title: articleData.title,
        description: articleData.description,
        thumbnail: thumbnailUrl,
        tags: articleData.tags || [],
        category: new Types.ObjectId(articleData.category as string),
        author: new Types.ObjectId(articleData.author as string),
      };

      const createdArticle = await this._articleRepository.create(newArticle);

      console.log("Article created:", createdArticle);

      const articleResponse = await this.getArticleResponse(
        createdArticle._id.toString(),
        articleData.author
      );

      return {
        message: "Article posted successfully",
        article: articleResponse,
      };
    } catch (error: any) {
      console.error("Error in articleCreate:", error);
      throw {
        status: error.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: error.message || "Failed to create article",
        code: error.code || "CREATE_ARTICLE_ERROR",
      };
    }
  }

async updateArticleService(articleData: articleUpdateRequestDTO): Promise<{article: ArticleResponseDTO }> {
  const { _id, title, description, category, tags, author, thumbnail } = articleData;

  const updateData: any = {
    title,
    description,
    category,
    tags,
    author,
  };

  let tempUrl = 'https://myhealth-app-storage.s3.ap-south-1.amazonaws.com/thinklet_thumbnails/download+(3).jfif'
  if (thumbnail !== undefined) {
    let thumbnailUrl: string | null = null;
    if (typeof thumbnail === 'string') {
      thumbnailUrl = thumbnail === '' ? tempUrl : thumbnail;
    } else if (thumbnail) {
      const uploadResult = await uploadFileToS3(
        thumbnail.buffer,
        thumbnail.originalname,
        'thinklet_thumbnails',
        thumbnail.mimetype
      );
      if (!uploadResult?.fileUrl) {
        throw {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to upload thumbnail',
          code: 'THUMBNAIL_UPLOAD_FAILED',
        };
      }
      thumbnailUrl = uploadResult.fileUrl;
    }
    if (thumbnailUrl !== null) {
      updateData.thumbnail = thumbnailUrl;
    } else {
      updateData.thumbnail = null;
    }
  }

  const updatedArticle = await this._articleRepository.update(_id, updateData);
  if (!updatedArticle) {
    throw {
      status: HttpStatusCode.NOT_FOUND,
      message: 'Article not found',
      code: 'ARTICLE_NOT_FOUND',
    };
  }

  const updated = await this.getArticleResponse(updatedArticle._id.toString(), updatedArticle.author.toString());

  return { article: updated };
};



  async getPreferenceArticlesService(
    preferences: IPreference[],
    limit: number,
    articleSet: number,
    userId: string
  ): Promise<{ articles: ArticleResponseDTO[] }> {
    try {
      if (!preferences || preferences.length === 0) {
        return { articles: [] };
      }

      const preferenceIds = preferences.map((pref) => pref._id);
      const skip = (articleSet - 1) * limit;

      const articles = await this._articleRepository.findAll(
        {
          $or: [
            { category: { $in: preferenceIds } },
            { tags: { $in: preferences.map((pref) => pref.name) } },
          ],
        },
        { sort: { createdAt: -1 }, limit: limit, skip: skip }
      );


      console.log("articles are.............................",articles)

      const formattedArticles = await Promise.all(
        articles.map(async (article) => {
          return await this.getArticleResponse(article._id.toString(), userId);
        })
      );


      console.log("formattedArticles are.............................",formattedArticles)


      return { articles: formattedArticles };
    } catch (error: any) {
      console.error("Error in getPreferenceArticlesService:", error);
      throw {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: error.message || "Failed to fetch preference articles",
        code: "FETCH_ARTICLES_ERROR",
      };
    }
  }

  async getMyArticleService(
    userId: string
  ): Promise<{ articles: ArticleResponseDTO[] }> {
    try {
      // const skip = (articleSet - 1) * limit;
      // .sort({ createdAt: -1 })
      // .skip(skip)
      // .limit(limit)
      // .lean();

      const articles = await this._articleRepository.findAll({
        author: userId,
      });

      const formattedArticles = await Promise.all(
        articles.map(async (article) => {
          return await this.getArticleResponse(article._id.toString(), userId);
        })
      );

      return { articles: formattedArticles };
    } catch (error: any) {
      console.error("Error in getPreferenceArticlesService:", error);
      throw {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: error.message || "Failed to fetch preference articles",
        code: "FETCH_ARTICLES_ERROR",
      };
    }
  }

  async deleteArticleService(articleId: string): Promise<{ message: string }> {
    try {
      if (!articleId) {
        throw {
          status: HttpStatusCode.BAD_REQUEST,
          message: "Article ID is required",
          code: "MISSING_ARTICLE_ID",
        };
      }

      const deletedArticle = await this._articleRepository.delete(articleId);

      if (!deletedArticle) {
        throw {
          status: HttpStatusCode.NOT_FOUND,
          message: "Article not found",
          code: "ARTICLE_NOT_FOUND",
        };
      }
      return { message: "Article deleted successfully" };
    } catch (error: any) {
      console.error("Error in deleteArticleService:", error);
      throw {
        status: error.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: error.message || "Failed to delete article",
        code: error.code || "DELETE_ARTICLE_ERROR",
      };
    }
  }

  async getArticleService(
    articleId: string,
    userId?: string
  ): Promise<ArticleResponseDTO> {
    try {
      const articleResponse = await this.getArticleResponse(articleId, userId);

      console.log("Article fetched in service:", articleResponse);

      return articleResponse;
    } catch (error: any) {
      console.error("Error in getArticleService:", error);
      throw {
        status: error.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: error.message || "Failed to fetch article",
        code: error.code || "FETCH_ARTICLE_ERROR",
      };
    }
  }

  async likeArticleService(
    articleId: string,
    userId: string
  ): Promise<{ liked: boolean; likesCount: number; dislikesCount: number }> {
    try {
      // Validate inputs
      if (!articleId || !userId) {
        throw {
          status: HttpStatusCode.BAD_REQUEST,
          message: "Article ID and user ID are required",
          code: "MISSING_FIELDS",
        };
      }

      // Check if article exists

      const article = await this._articleRepository.findOne({ _id: articleId });
      if (!article) {
        throw {
          status: HttpStatusCode.NOT_FOUND,
          message: "Article not found",
          code: "ARTICLE_NOT_FOUND",
        };
      }

      // Find or create interaction
      let interaction = await this._interactionRepository.findOne({
        user: userId,
        article: articleId,
      });

      if (interaction) {
        // Toggle like: if already liked, remove like; if disliked, remove dislike and add like
        if (interaction.like) {
          interaction.like = false;
        } else {
          interaction.like = true;
          interaction.dislike = false; // Ensure mutual exclusivity
        }
        await interaction.save();
      } else {
        // Create new interaction with like
        interaction = await this._interactionRepository.create({
          user: new Types.ObjectId(userId as string),
          article: new Types.ObjectId(articleId as string),
          like: true,
          dislike: false,
        });
      }

      // Calculate updated counts
      const [likesCount, dislikesCount] = await Promise.all([
        this._interactionRepository.countDocuments({
          article: articleId,
          like: true,
        }),
        this._interactionRepository.countDocuments({
          article: articleId,
          dislike: true,
        }),
      ]);

      return {
        liked: interaction.like,
        likesCount,
        dislikesCount,
      };
    } catch (error: any) {
      console.error("Error in likeArticleService:", error);
      throw {
        status: error.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: error.message || "Failed to like article",
        code: error.code || "LIKE_ARTICLE_ERROR",
      };
    }
  }

  async dislikeArticleService(
    articleId: string,
    userId: string
  ): Promise<{ disliked: boolean; likesCount: number; dislikesCount: number }> {
    try {
      // Validate inputs
      if (!articleId || !userId) {
        throw {
          status: HttpStatusCode.BAD_REQUEST,
          message: "Article ID and user ID are required",
          code: "MISSING_FIELDS",
        };
      }

      // Check if article exists
      const article = await this._articleRepository.findOne({ _id: articleId });
      if (!article) {
        throw {
          status: HttpStatusCode.NOT_FOUND,
          message: "Article not found",
          code: "ARTICLE_NOT_FOUND",
        };
      }

      // Find or create interaction
      let interaction = await this._interactionRepository.findOne({
        user: userId,
        article: articleId,
      });

      if (interaction) {
        // Toggle dislike: if already disliked, remove dislike; if liked, remove like and add dislike
        if (interaction.dislike) {
          interaction.dislike = false;
        } else {
          interaction.dislike = true;
          interaction.like = false; // Ensure mutual exclusivity
        }
        await interaction.save();
      } else {
        // Create new interaction with dislike
        interaction = await this._interactionRepository.create({
          user: new Types.ObjectId(userId as string),
          article: new Types.ObjectId(articleId as string),
          like: false,
          dislike: true,
        });
      }

      // Calculate updated counts
      const [likesCount, dislikesCount] = await Promise.all([
        this._interactionRepository.countDocuments({
          article: articleId,
          like: true,
        }),
        this._interactionRepository.countDocuments({
          article: articleId,
          dislike: true,
        }),
      ]);

      return {
        disliked: interaction.dislike,
        likesCount,
        dislikesCount,
      };
    } catch (error: any) {
      console.error("Error in dislikeArticleService:", error);
      throw {
        status: error.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: error.message || "Failed to dislike article",
        code: error.code || "DISLIKE_ARTICLE_ERROR",
      };
    }
  }






}
