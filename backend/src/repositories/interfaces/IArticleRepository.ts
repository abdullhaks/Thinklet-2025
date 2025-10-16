import BaseRepository from "../implementations/baseRepository";
import { articleDocument, IArticleDocument } from "../../entities/articleEntity";
import { ArticleResponseDTO } from "../../dto/articleDto";



export default interface IArticleRepository extends BaseRepository<IArticleDocument> {
  
getArticle(id: string): Promise<any | null>;


    
};