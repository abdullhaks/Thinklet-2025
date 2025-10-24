import {
  ArticleResponseDTO,
  articleUpdateRequestDTO,
  IArticleData,
} from "../../../dto/articleDto";
import { IPreference } from "../../../dto/userDto";

interface IThumbnail {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

export default interface IArticleService {
  getArticleResponse(
    articleId: string,
    userId?: string
  ): Promise<ArticleResponseDTO>;

  articleCreate(
    articleData: Partial<IArticleData>,
    thumbnail?: IThumbnail
  ): Promise<{ message: string; article: ArticleResponseDTO }>;

  updateArticleService(
    articleData: articleUpdateRequestDTO
  ): Promise<{ article: ArticleResponseDTO }>;

  getSearchedArticlesService(
    query: string,
    limit: number,
    articleSet: number,
    userId: string
  ): Promise<{ articles: ArticleResponseDTO[] }>;

  getPreferenceArticlesService(
    all: boolean,
    preferences: IPreference[],
    limit: number,
    articleSet: number,
    userId: string
  ): Promise<{ articles: ArticleResponseDTO[] }>;

  getMyArticleService(
    userId: string
  ): Promise<{ articles: ArticleResponseDTO[] }>;

  deleteArticleService(articleId: string): Promise<{ message: string }>;

  getArticleService(
    articleId: string,
    userId?: string
  ): Promise<ArticleResponseDTO>;

  likeArticleService(
    articleId: string,
    userId: string
  ): Promise<{ liked: boolean; likesCount: number; dislikesCount: number }>;

  dislikeArticleService(
    articleId: string,
    userId: string
  ): Promise<{ disliked: boolean; likesCount: number; dislikesCount: number }>;
}
