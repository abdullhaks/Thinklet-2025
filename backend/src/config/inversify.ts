import { Container } from "inversify";

//models
import Article from "../models/article";
import Category from "../models/category";
import Interaction from "../models/interaction";
import User from "../models/user";

//controllers
import ArticleController from "../controllers/implementations/user/articleController";
import IArticleController from "../controllers/interfaces/user/IArticleController";

//services
import ArticleService from "../services/implementations/user/articleService";
import IArticleService from "../services/interfaces/user/IArticleService";

//repositories
import ArticleRepository from "../repositories/implementations/articleRepository";
import IArticleRepository from "../repositories/interfaces/IArticleRepository";
import IInteractionRepository from "../repositories/interfaces/IInteractionRepository";
import InteractionRepository from "../repositories/implementations/interactionRepository";
import IUserRepository from "../repositories/interfaces/IUserRepository";
import UserRepository from "../repositories/implementations/userRepository";
import ICategoryRepository from "../repositories/interfaces/IcategoryRepository";
import CategoryRepository from "../repositories/implementations/categoryRepository";

//-------------------------------------------------------------------------------
const container = new Container();
//-------------------------------------------------------------------------------

//model binding

if(Article){
container.bind("articleModel").toConstantValue(Article);
}else{
  console.log("article model error");
  
}

if(Category){
container.bind("categoryModel").toConstantValue(Category);

}else{
  console.log("Category model error");
  
}

if(User){
container.bind("userModel").toConstantValue(User);

}else{
  console.log("User model error");
  
}

if(Interaction){
container.bind("interactionModel").toConstantValue(Interaction);
}else{
  console.log("Interaction model error");
  
}



//repository binding
container.bind<IArticleRepository>("IArticleRepository").to(ArticleRepository);
container.bind<IInteractionRepository>("IInteractionRepository").to(InteractionRepository);
container.bind<IUserRepository>("IUserRepository").to(UserRepository);
container.bind<ICategoryRepository>("ICategoryRepository").to(CategoryRepository);

//service binding

if(ArticleService){
console.log("service connected.....")
container.bind<IArticleService>("IArticleService").to(ArticleService)

}

//controller binding
container.bind<IArticleController>("IArticleController").to(ArticleController);

export default container;
