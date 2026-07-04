import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import { AUTH } from "@/constants/endpoints";
import { ROUTES } from "@/constants/routes";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

const api = axios.create({
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(AUTH.REFRESH, {}, { withCredentials: true });
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        window.location.href = window.location.origin + ROUTES.LOGIN;
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { error?: { message?: string } }
      | undefined;
    if (data?.error?.message) return data.error.message;
    if (error.response?.status === 429) return "Too many requests. Please try again later.";
    if (error.response?.status === 500) return "Server error. Please try again later.";
    if (error.response?.status === 404) return "Resource not found.";
    if (error.response?.status === 403) return "You do not have permission to perform this action.";
    if (error.response?.status === 401) return "Please login to continue.";
    if (error.code === "ERR_NETWORK") return "Unable to connect to server. Please check your connection.";
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}

export function handleApiError(error: unknown): never {
  const message = getErrorMessage(error);
  toast.error(message);
  throw error;
}

export default api;
