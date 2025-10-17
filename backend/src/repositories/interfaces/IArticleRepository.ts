import BaseRepository from "../implementations/baseRepository";
import { IArticleDocument } from "../../entities/articleEntity";

export default interface IArticleRepository
  extends BaseRepository<IArticleDocument> {
  getArticle(id: string): Promise<any | null>;
}
