import { Request, Response } from 'express';

import { HttpStatusCode } from '../../utils/enum';
import { MESSAGES } from '../../utils/messages';
import { articleCreate, getPreferenceArticlesService } from '../../services/user/articleService';
import { IPreference } from '../../dto/userDto';


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



export const createArticle = async (req: Request, res: Response): Promise<void> => {


  console.log("herere.e.e...e. bakend.....")

  try {
    const { title,description, category, tags, author  } = req.body;

    const articleDetail = { title,description, category, tags, author }

    console.log("articleDetail  is ", articleDetail);

    const thumbnailFile = (req.files as MulterFiles)
        ?.thumbnail?.[0];


     
      const thumbnail =  thumbnailFile
          ? {
              buffer: thumbnailFile.buffer,
              originalname: thumbnailFile.originalname,
              mimetype: thumbnailFile.mimetype,
            }
          : undefined

    const response = await articleCreate (articleDetail,thumbnail);

    
    res.status(HttpStatusCode.CREATED).json(response.article);
  } catch (error: any) {
    console.error("Error create article :", error);
    res.status(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error.message || MESSAGES.server.serverError,
      code: error.code || 'SERVER_ERROR'
    });
  }
};


export const getPreferenceArticlesController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { preferences,userId, limit = 5, articleSet = 1 } = req.query;

    console.log("preference...",preferences);
    console.log("userId...",userId);
    

    // Validate preferences
    if (!userId || !preferences || !Array.isArray(JSON.parse(preferences as string))) {
      throw {
        status: HttpStatusCode.BAD_REQUEST,
        message: 'Preferences must be provided as an array',
        code: 'INVALID_PREFERENCES',
      };
    }

    const parsedPreferences: IPreference[] = JSON.parse(preferences as string);
    const parsedLimit = parseInt(limit as string, 10);
    const parsedArticleSet = parseInt(articleSet as string, 10);

    if (isNaN(parsedLimit) || isNaN(parsedArticleSet) || parsedLimit <= 0 || parsedArticleSet <= 0) {
      throw {
        status: HttpStatusCode.BAD_REQUEST,
        message: 'Invalid limit or articleSet',
        code: 'INVALID_PAGINATION',
      };
    }

    const response = await getPreferenceArticlesService(parsedPreferences, parsedLimit, parsedArticleSet,userId.toString());

    res.status(HttpStatusCode.OK).json({
      message: MESSAGES.user.articlesFetched,
      articles: response.articles,
    });
  } catch (error: any) {
    console.error('Error in getPreferenceArticlesController:', error);
    res.status(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error.message || MESSAGES.server.serverError,
      code: error.code || 'SERVER_ERROR',
    });
  }
};