import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";

import { persistor, store } from "../redux/store/store";
import { logoutUser } from "../redux/slices/userSlice";

import {
  accessToken as userAccessToken,
  logoutUser as userLogout,
} from "../services/apis/userApi";

import { HttpStatusCode } from "./enum";
import { message } from "antd";

interface ErrorResponse {
  success: boolean;
  error: {
    message: string;
    code?: string;
  };
}

declare module "axios" {
  interface InternalAxiosRequestConfig {
    isRetry?: boolean;
  }
}

const apiUrl = import.meta.env.VITE_API_URL as string;

//Helper to determine role from URL pathsdf

const getRoleFromURL = (url?: string): "user" | "admin" | null => {
  if (!url) return null;
  if (url.includes("api/user")) return "user";
  // if (url.includes("api/admin")) return "admin";
  return null;
};

/**
 * Logout logic for each role
 */
const handleLogout = async (role: string, error: AxiosError<ErrorResponse>) => {
  console.log(`Handling logout for ${role} due to error:`, error);

  switch (role) {
    case "user":
      store.dispatch(logoutUser());
      await persistor.purge();
      await userLogout();
      window.location.href = "/";

      break;

    // case "admin":
    //   store.dispatch(logoutAdmin());
    //   await adminLogout();
    //   localStorage.removeItem("adminEmail");
    //   await persistor.purge();
    //   window.location.href = "/admin/login";

    //   break;
  }

  message.error(error.message || "Session expired. Please login again.");
};

/**
 * Token refresh per role
 */
const handleTokenRefresh = async (
  originalRequest: InternalAxiosRequestConfig,
  role: "user" | "admin"
) => {
  try {
    let response;

    switch (role) {
      case "user":
        response = await userAccessToken();
        break;

      // case "admin":
      //   response = await adminRefreshToken();
      //   break;
    }

    console.log(`Token refreshed for ${role}:`, response);
    return axios(originalRequest);
  } catch (err) {
    await handleLogout(role, err as AxiosError<ErrorResponse>);
    throw err;
  }
};

//Factory for role-based axios instances

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
  });

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<ErrorResponse>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig;

      console.log("original request is ", originalRequest);
      const role = getRoleFromURL(
        `${originalRequest?.baseURL}${originalRequest?.url}`
      );
      if (!role) return Promise.reject(error);

      if (
        error.response?.status === HttpStatusCode.UNAUTHORIZED &&
        !originalRequest.isRetry
      ) {
        originalRequest.isRetry = true;
        console.log(`401 for ${role}. Attempting token refresh...`);
        return handleTokenRefresh(originalRequest, role);
      } else if (originalRequest.isRetry) {
        console.log(`retry.....Logging out...`);
        await handleLogout(role, error);
        return;
      } else if (error.response?.status === HttpStatusCode.FORBIDDEN) {
        console.log(`403 for ${role}. Logging out...`);
        await handleLogout(role, error);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const userInstance = createAxiosInstance();
// export const adminInstance = createAxiosInstance();
