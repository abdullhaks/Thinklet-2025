import { userInstance } from "../../utils/axiosFactory";
import { ROUTES } from "../../constants/routes";
import type { IPreference } from "../../interfaces/user";

export const signupUser = async (userData: any) => {
  try {
    const response = await userInstance.post(ROUTES.user.signup, userData);
    return response.data;
  } catch (error: any) {
    console.error("Error signing up user:", error);
    throw {
      message: error.response?.data?.message || "Failed to sign up",
      code: error.response?.data?.code || "SERVER_ERROR",
    };
  }
};

export const getCategories = async () => {
  try {
    const response = await userInstance.get(ROUTES.user.category);
    return response.data;
  } catch (error: any) {
    console.error("Error signing up user:", error);
    throw {
      message: error.response?.data?.message || "Failed to fetch categories",
      code: error.response?.data?.code || "SERVER_ERROR",
    };
  }
};

export const loginUser = async (userData: any) => {
  try {
    const response = await userInstance.post(ROUTES.user.login, userData);
    console.log("Login response:", response.data);
    return response.data;
  } catch (error:any) {
    console.error("Error logging in user:", error);
    throw error.response.data;
  }
};

export const changePassword = async (passwordData: any) => {
  try {
    const response = await userInstance.post(
      ROUTES.user.changePassword,
      passwordData
    );
    return response.data;
  } catch (error: any) {
    console.error("Error changing password:", error);
    throw {
      message: error.response?.data?.message || "Failed to change password",
      code: error.response?.data?.code || "SERVER_ERROR",
    };
  }
};

export const accessToken = async () => {
  try {
    const response = await userInstance.get(ROUTES.user.accessToken);

    console.log("user api response is ", response);

    return response.data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await userInstance.post(ROUTES.user.logout);
    return response.data;
  } catch (error) {
    console.error("Error logging out user:", error);
    throw error;
  }
};

export const getArticle = async (articleId: string) => {
  try {
    console.log("In getArticle API with:", { articleId });
    const response = await userInstance.get(ROUTES.user.article, {
      params: {
        articleId
      },
    });

    console.log("Article API response:", response);

    return response.data;
  } catch (error: any) {
    console.error("Error in fetching article:", error);
    throw {
      message: error.response?.data?.message || "Failed to fetch article",
      code: error.response?.data?.code || "SERVER_ERROR",
    };
  }
};

export const createArticle = async (articleData: FormData) => {
  console.log("herere.e.e...e.");
  try {
    const response = await userInstance.post(
      ROUTES.user.articleCreate,
      articleData
    );
    return response.data;
  } catch (error: any) {
    console.error("Article posting failed:", error);
    throw {
      message: error.response?.data?.message || "Failed to sign up",
      code: error.response?.data?.code || "SERVER_ERROR",
    };
  }
};

export const updateArticle = async (articleData: FormData) => {
  try {
    const response = await userInstance.put(
      ROUTES.user.articleUpdate,
      articleData
    );
    return response.data;
  } catch (error: any) {
    console.error("Article updating failed:", error);
    throw {
      message: error.response?.data?.message || "Failed to update article",
      code: error.response?.data?.code || "SERVER_ERROR",
    };
  }
};

export const getPreferenceArticles = async (
  all:boolean,
  preferences: IPreference[],
  limit: number,
  articleSet: number,
  userId: string
) => {
  try {
    const response = await userInstance.get(ROUTES.user.preferenceArticles, {
      params: {
        all,
        preferences: JSON.stringify(preferences),
        limit,
        articleSet,
        userId,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error in fetching preference articles:", error);
    throw {
      message:
        error.response?.data?.message || "Failed to fetch preference articles",
      code: error.response?.data?.code || "SERVER_ERROR",
    };
  }
};



export const getSearchedArticles = async (
  query: string,
  limit: number,
  articleSet: number,
  userId: string
) => {
  try {
    const response = await userInstance.get(ROUTES.user.searchArticles, {
      params: {
        query,
        limit,
        articleSet,
        userId,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error in fetching searched articles:", error);
    throw {
      message:
        error.response?.data?.message || "Failed to fetch searched articles",
      code: error.response?.data?.code || "SERVER_ERROR",
    };
  }
};

export const getMyArticles = async (
  // limit: number,
  // articleSet: number,
  userId: string
) => {
  try {
    const response = await userInstance.get(ROUTES.user.myArticle, {
      params: {
        userId,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error in fetching preference articles:", error);
    throw {
      message:
        error.response?.data?.message || "Failed to fetch preference articles",
      code: error.response?.data?.code || "SERVER_ERROR",
    };
  }
};

export const deleteArticle = async (articleId: string) => {
  try {
    const response = await userInstance.delete(
      `${ROUTES.user.article}/${articleId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error in deleting article:", error);
    throw {
      message: error.response?.data?.message || "Failed to delete article",
      code: error.response?.data?.code || "SERVER_ERROR",
    };
  }
};

export const updateProfile = async (profileData: any) => {
  try {
    const response = await userInstance.put(
      ROUTES.user.updateProfile,
      profileData
    );
    return response.data;
  } catch (error: any) {
    console.error("Error in updating profile:", error);
    throw {
      message: error.response?.data?.message || "Failed to update profile",
      code: error.response?.data?.code || "SERVER_ERROR",
    };
  }
};

export const updateProfileImage = async (imageData: FormData) => {
  try {
    const response = await userInstance.put(
      ROUTES.user.updateProfileImage,
      imageData
    );
    return response.data;
  } catch (error: any) {
    console.error("Error in updating profile image:", error);
    throw {
      message:
        error.response?.data?.message || "Failed to update profile image",
      code: error.response?.data?.code || "SERVER_ERROR",
    };
  }
};

export const likeArticle = async (articleId: string) => {
  try {
    console.log("In likeArticle API with:", { articleId});
    const response = await userInstance.post(ROUTES.user.likeArticle, {
      articleId
    });
    return response.data;
  } catch (error: any) {
    console.error("Error in liking article:", error);
    throw {
      message: error.response?.data?.message || "Failed to like article",
      code: error.response?.data?.code || "SERVER_ERROR",
    };
  }
};

export const dislikeArticle = async (articleId: string) => {
  try {
    console.log("In dislikeArticle API with:", { articleId });
    const response = await userInstance.post(ROUTES.user.dislikeArticle, {
      articleId
    });
    return response.data;
  } catch (error: any) {
    console.error("Error in disliking article:", error);
    throw {
      message: error.response?.data?.message || "Failed to dislike article",
      code: error.response?.data?.code || "SERVER_ERROR",
    };
  }
};
