import Category from '../../models/category';
import { HttpStatusCode } from '../../utils/enum';


export const getCategories = async (): Promise<any> => {
 

  const categories = await Category.find();
  console.log("categories...: ", categories);
 
  return {
    message: "Signup successful",
    categories: categories,
  };
  
};
