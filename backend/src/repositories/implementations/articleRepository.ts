import { inject, injectable } from "inversify";
import BaseRepository from "./baseRepository";
import { articleDocument } from "../../entities/articleEntity";
import { Model } from "mongoose";
import { ArticleResponseDTO } from "../../dto/articleDto";

@injectable()
export default class ArticleRepository extends BaseRepository<articleDocument> {
  constructor(
    @inject("articleModel") private _articleModel: Model<articleDocument>
  ) {
    super(_articleModel);
  }

  async getArticle(id: string): Promise<any | null> {
    const article = await this._articleModel
      .findById(id)
      .populate("author", "firstName lastName profile _id")
      .populate("category", "name _id")
      .lean();

    return article; // Return raw populated document, not transformed DTO
  }
}
