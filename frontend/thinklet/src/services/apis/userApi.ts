import { userInstance } from "../../utils/axiosFactory";
import { ROUTES } from "../../constants/routes";

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
