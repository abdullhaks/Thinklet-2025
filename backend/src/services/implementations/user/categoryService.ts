import { inject, injectable } from 'inversify';
import ICategoryService from '../../interfaces/user/ICategoryService';
import ICategoryRepository from '../../../repositories/interfaces/IcategoryRepository';


@injectable()
export default class CategoryService implements ICategoryService{


  constructor(
    @inject("ICategoryRepository") private _categoryRepository : ICategoryRepository
  ){}


async getCategories(): Promise<any> {
 
  const categories =   await this._categoryRepository.findAll();
  console.log("categories...: ", categories);
 
  return {
    message: "Signup successful",
    categories: categories,
  };
  
};



}