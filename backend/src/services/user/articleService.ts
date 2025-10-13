// src/services/user/articleService.ts
import Article from '../../models/article';
import Interaction from '../../models/interaction';
import Category from '../../models/category';
import { uploadFileToS3 } from '../../helpers/uploadS3';
import { HttpStatusCode } from '../../utils/enum';
import { ArticleResponseDTO, IArticleData } from '../../dto/articleDto';
import { IPreference } from '../../dto/userDto';

interface IThumbnail {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}


interface aggregationResult   {

  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  author:{
    _id: string;
    firstName: string;
    lastName: string;
    profile?: string;
  };
  category: {
    _id: string;
    name: string;
  }


}


export const getArticleResponse = async (articleId: string, userId?: string): Promise<ArticleResponseDTO> => {
  try {
    // Validate articleId
    if (!articleId) {
      throw {
        status: HttpStatusCode.BAD_REQUEST,
        message: 'Article ID is required',
        code: 'MISSING_ARTICLE_ID',
      };
    }

    // Fetch article with populated references
    const article = await Article.findById(articleId)
      .populate('author', 'firstName lastName profile _id')
      .populate('category', 'name _id')
      .lean();

    if (!article) {
      throw {
        status: HttpStatusCode.NOT_FOUND,
        message: 'Article not found',
        code: 'ARTICLE_NOT_FOUND',
      };
    }

  const typedArticle: aggregationResult = JSON.parse( JSON.stringify(article) ); 

    // Aggregate likes/dislikes count
    const [likesCount, dislikesCount] = await Promise.all([
      Interaction.countDocuments({ article: articleId, like: true }),
      Interaction.countDocuments({ article: articleId, dislike: true }),
    ]);

    // Get user’s interaction if userId is provided
    let userInteraction = {
      liked: false,
      disliked: false,
      blocked: false,
    };

    if (userId) {
      const interaction = await Interaction.findOne({
        article: articleId,
        user: userId,
      }).lean();

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
      message: error.message || 'Failed to fetch article',
      code: error.code || 'FETCH_ARTICLE_ERROR',
    };
  }
};

export const articleCreate = async (
  articleData: Partial<IArticleData>,
  thumbnail?: IThumbnail
): Promise<{ message: string; article: ArticleResponseDTO }> => {
  try {
    // Validate required fields
    if (!articleData.title || !articleData.description || !articleData.category || !articleData.author) {
      throw {
        status: HttpStatusCode.BAD_REQUEST,
        message: 'Please provide all required fields (title, description, category, author)',
        code: 'MISSING_FIELDS',
      };
    }

    // Validate category
    const categoryExists = await Category.findById(articleData.category);
    if (!categoryExists) {
      throw {
        status: HttpStatusCode.BAD_REQUEST,
        message: 'Invalid category',
        code: 'INVALID_CATEGORY',
      };
    }

    // Handle thumbnail upload
    let thumbnailUrl: string | undefined;
    if (thumbnail) {
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

    // Create new article
    const newArticle = {
      title: articleData.title,
      description: articleData.description,
      thumbnail: thumbnailUrl,
      tags: articleData.tags || [],
      category: articleData.category,
      author: articleData.author,
    };

    const createdArticle = await Article.create(newArticle);
    console.log('Article created:', createdArticle);

    // Convert to ArticleResponseDTO
    const articleResponse = await getArticleResponse(createdArticle._id.toString(), articleData.author);

    return {
      message: 'Article posted successfully',
      article: articleResponse,
    };
  } catch (error: any) {
    console.error('Error in articleCreate:', error);
    throw {
      status: error.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to create article',
      code: error.code || 'CREATE_ARTICLE_ERROR',
    };
  }
};

export const getPreferenceArticlesService = async (
  preferences: IPreference[],
  limit: number,
  articleSet: number,
  userId: string
): Promise<{ articles: ArticleResponseDTO[] }> => {
  try {
    if (!preferences || preferences.length === 0) {
      return { articles: [] };
    }

    const preferenceIds = preferences.map((pref) => pref._id);
    const skip = (articleSet - 1) * limit;

    const articles = await Article.find({
      $or: [
        { category: { $in: preferenceIds } },
        { tags: { $in: preferences.map((pref) => pref.name) } },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const formattedArticles = await Promise.all(
      articles.map(async (article) => {
        return await getArticleResponse(article._id.toString(), userId);
      })
    );

    return { articles: formattedArticles };
  } catch (error: any) {
    console.error('Error in getPreferenceArticlesService:', error);
    throw {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to fetch preference articles',
      code: 'FETCH_ARTICLES_ERROR',
    };
  }
};



export const getMyArticleService = async (
  userId: string
): Promise<{ articles: ArticleResponseDTO[] }> => {
  try {


    // const skip = (articleSet - 1) * limit;

    const articles = await Article.find({ author: userId })
      // .sort({ createdAt: -1 })
      // .skip(skip)
      // .limit(limit)
      // .lean();

    const formattedArticles = await Promise.all(
      articles.map(async (article) => {
        return await getArticleResponse(article._id.toString(), userId);
      })
    );

    return { articles: formattedArticles };
  } catch (error: any) {
    console.error('Error in getPreferenceArticlesService:', error);
    throw {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to fetch preference articles',
      code: 'FETCH_ARTICLES_ERROR',
    };
  }
};




export const getArticleService = async (articleId: string, userId?: string): Promise<ArticleResponseDTO> => {
  try {
    const articleResponse = await getArticleResponse(articleId, userId);

    console.log('Article fetched in service:', articleResponse);

    return articleResponse;
  } catch (error: any) {
    console.error('Error in getArticleService:', error);
    throw {
      status: error.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to fetch article',
      code: error.code || 'FETCH_ARTICLE_ERROR',
    };
  }
};

export const likeArticleService = async (
  articleId: string,
  userId: string
): Promise<{ liked: boolean; likesCount: number; dislikesCount: number }> => {
  try {
    // Validate inputs
    if (!articleId || !userId) {
      throw {
        status: HttpStatusCode.BAD_REQUEST,
        message: 'Article ID and user ID are required',
        code: 'MISSING_FIELDS',
      };
    }

    // Check if article exists
    const article = await Article.findById(articleId);
    if (!article) {
      throw {
        status: HttpStatusCode.NOT_FOUND,
        message: 'Article not found',
        code: 'ARTICLE_NOT_FOUND',
      };
    }

    // Find or create interaction
    let interaction = await Interaction.findOne({ user: userId, article: articleId });

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
      interaction = await Interaction.create({
        user: userId,
        article: articleId,
        like: true,
        dislike: false,
      });
    }

    // Calculate updated counts
    const [likesCount, dislikesCount] = await Promise.all([
      Interaction.countDocuments({ article: articleId, like: true }),
      Interaction.countDocuments({ article: articleId, dislike: true }),
    ]);

    return {
      liked: interaction.like,
      likesCount,
      dislikesCount,
    };
  } catch (error: any) {
    console.error('Error in likeArticleService:', error);
    throw {
      status: error.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to like article',
      code: error.code || 'LIKE_ARTICLE_ERROR',
    };
  }
};

export const dislikeArticleService = async (
  articleId: string,
  userId: string
): Promise<{ disliked: boolean; likesCount: number; dislikesCount: number }> => {
  try {
    // Validate inputs
    if (!articleId || !userId) {
      throw {
        status: HttpStatusCode.BAD_REQUEST,
        message: 'Article ID and user ID are required',
        code: 'MISSING_FIELDS',
      };
    }

    // Check if article exists
    const article = await Article.findById(articleId);
    if (!article) {
      throw {
        status: HttpStatusCode.NOT_FOUND,
        message: 'Article not found',
        code: 'ARTICLE_NOT_FOUND',
      };
    }

    // Find or create interaction
    let interaction = await Interaction.findOne({ user: userId, article: articleId });

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
      interaction = await Interaction.create({
        user: userId,
        article: articleId,
        like: false,
        dislike: true,
      });
    }

    // Calculate updated counts
    const [likesCount, dislikesCount] = await Promise.all([
      Interaction.countDocuments({ article: articleId, like: true }),
      Interaction.countDocuments({ article: articleId, dislike: true }),
    ]);

    return {
      disliked: interaction.dislike,
      likesCount,
      dislikesCount,
    };
  } catch (error: any) {
    console.error('Error in dislikeArticleService:', error);
    throw {
      status: error.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to dislike article',
      code: error.code || 'DISLIKE_ARTICLE_ERROR',
    };
  }
};