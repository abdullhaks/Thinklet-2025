import { Request, Response } from 'express';

import { HttpStatusCode } from '../../utils/enum';
import { MESSAGES } from '../../utils/messages';
import { articleCreate } from '../../services/user/articleService';


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