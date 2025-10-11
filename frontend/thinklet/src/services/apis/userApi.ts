import { userInstance } from "../../utils/axiosFactory";
import { ROUTES } from "../../constants/routes";
import { article } from "framer-motion/client";

export const signupUser = async (userData: any) => {
  try {
    const response = await userInstance.post(ROUTES.user.signup, userData);
    return response.data;
  } catch (error: any) {
    console.error("Error signing up user:", error);
    throw {
      message: error.response?.data?.message || "Failed to sign up",
      code: error.response?.data?.code || "SERVER_ERROR"
    };
  }
};


export const getCategories = async ()=>{
  try{
    const response = await userInstance.get(ROUTES.user.category);
    return response.data;

  }catch(error:any){
    console.error("Error signing up user:", error);
    throw {
      message: error.response?.data?.message || "Failed to fetch categories",
      code: error.response?.data?.code || "SERVER_ERROR"
    };
  }
}


export const loginUser = async (userData:any) => {
  try {
    const response = await userInstance.post(ROUTES.user.login, userData);
    console.log("Login response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};


export const accessToken = async () => {
  try {
    const response = await userInstance.post(ROUTES.user.accessToken);

    console.log("user api response is ", response);

    return response.data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response= await userInstance.post(ROUTES.user.logout);
    return response.data;
  } catch (error) {
    console.error("Error logging out user:", error);
    throw error;
  }
};

export const getArticle = async (articleId:string)=>{
  try{

    const response =await userInstance.get(`${ROUTES.user.article}/${articleId}`);
    return response.data ;

  }catch(error:any){
     console.error("Error in fetching article:", error);
    throw {
      message: error.response?.data?.message || "Failed fetch article",
      code: error.response?.data?.code || "SERVER_ERROR"
  }
}

};


export const createArticle = async (articleData:FormData)=>{

  console.log("herere.e.e...e.")
  try{
    const response = await userInstance.post(ROUTES.user.articleCreate,articleData)
    return response.data;
  }catch(error:any){
     console.error("Article posting failed:", error);
    throw {
      message: error.response?.data?.message || "Failed to sign up",
      code: error.response?.data?.code || "SERVER_ERROR"
    };
  }
}