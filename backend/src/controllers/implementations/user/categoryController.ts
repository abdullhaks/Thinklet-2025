

import { Request, Response } from 'express';

import { HttpStatusCode } from '../../../utils/enum';
import { MESSAGES } from '../../../utils/messages';
import { getCategories } from '../../../services/implementations/user/categoryService';

export const categories = async (req: Request, res: Response): Promise<void> => {
  try {
    

    const categories = await getCategories();

    console.log("user is ", categories);

    res.status(HttpStatusCode.CREATED).json(categories);
  } catch (error: any) {
    console.error("Error in signup:", error);
    res.status(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error.message || MESSAGES.server.serverError,
      code: error.code || 'SERVER_ERROR'
    });
  }
};
