import axios from "axios";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "../utils/tokenStorage";

const baseURL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({ baseURL });

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

function redirectToLogin() {
  clearTokens();
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthEndpoint =
      originalRequest?.url?.includes("/portal/auth/request-code") ||
      originalRequest?.url?.includes("/portal/auth/verify-code") ||
      originalRequest?.url?.includes("/portal/auth/refresh");

    if (status !== 401 || !originalRequest || originalRequest._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      redirectToLogin();
      return Promise.reject(error);
    }

    try {
      if (!refreshPromise) {
        refreshPromise = axios
          .post(`${baseURL}/api/v1/portal/auth/refresh`, { refresh_token: refreshToken })
          .then((res) => {
            setTokens(res.data);
            return res.data.access_token;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      redirectToLogin();
      return Promise.reject(refreshError);
    }
  },
);

export default apiClient;
