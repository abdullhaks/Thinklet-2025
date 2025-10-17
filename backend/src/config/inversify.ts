import { Container } from "inversify";

//models
import Article from "../models/article";
import Category from "../models/category";
import Interaction from "../models/interaction";
import User from "../models/user";

//controllers
import ArticleController from "../controllers/implementations/user/articleController";
import IArticleController from "../controllers/interfaces/user/IArticleController";

import AuthController from "../controllers/implementations/user/authController";
import IAuthController from "../controllers/interfaces/user/IAuthController";

import CategoryController from "../controllers/implementations/user/categoryController";
import ICategoryController from "../controllers/interfaces/user/ICategoryController";

import ProfileController from "../controllers/implementations/user/profileController";
import IProfileController from "../controllers/interfaces/user/IProfileController";


//services
import ArticleService from "../services/implementations/user/articleService";
import IArticleService from "../services/interfaces/user/IArticleService";

import AuthService from "../services/implementations/user/authService";
import IAuthService from "../services/interfaces/user/IAuthService";


import CategoryService from "../services/implementations/user/categoryService";
import ICategoryService from "../services/interfaces/user/ICategoryService";


import ProfileService from "../services/implementations/user/profileService";
import IProfileService from "../services/interfaces/user/IProfileService";  



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

container.bind("articleModel").toConstantValue(Article);
container.bind("categoryModel").toConstantValue(Category);
container.bind("userModel").toConstantValue(User);
container.bind("interactionModel").toConstantValue(Interaction);



//repository binding
container.bind<IArticleRepository>("IArticleRepository").to(ArticleRepository);
container.bind<IInteractionRepository>("IInteractionRepository").to(InteractionRepository);
container.bind<IUserRepository>("IUserRepository").to(UserRepository);
container.bind<ICategoryRepository>("ICategoryRepository").to(CategoryRepository);




//service binding

container.bind<IArticleService>("IArticleService").to(ArticleService);
container.bind<IAuthService>("IAuthService").to(AuthService);
container.bind<ICategoryService>("ICategoryService").to(CategoryService);
container.bind<IProfileService>("IProfileService").to(ProfileService);



//controller binding
container.bind<IArticleController>("IArticleController").to(ArticleController);
container.bind<IAuthController>("IAuthController").to(AuthController);
container.bind<ICategoryController>("ICategoryController").to(CategoryController);
container.bind<IProfileController>("IProfileController").to(ProfileController);




export default container;
