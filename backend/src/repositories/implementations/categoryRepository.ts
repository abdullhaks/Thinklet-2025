import { inject, injectable } from "inversify";
import BaseRepository from "./baseRepository";
import { categoryDocument } from "../../entities/categoryEntity";
import { Model } from "mongoose";



@injectable()
export default class CategoryRepository extends BaseRepository<categoryDocument> {
  constructor(@inject("categoryModel") _categoryModel: Model<categoryDocument>) {
    super(_categoryModel);
  }






};
