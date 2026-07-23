import axios from "axios";
import {
  clearPortalSession,
  getPortalAccessToken,
  getPortalRefreshToken,
  setPortalTokens,
} from "../utils/portalTokenStorage";

// Falls back to the production backend when the env var is missing so a
// misconfigured build (e.g. the Android APK's CI build) can never silently
// point at an empty baseURL. Mirrors crm-landing's config default.
const baseURL = import.meta.env.VITE_API_URL || "https://crm-backend-production-49b2.up.railway.app";

const portalClient = axios.create({ baseURL });

portalClient.interceptors.request.use((config) => {
  const token = getPortalAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

function redirectToPortalLogin() {
  clearPortalSession();
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

portalClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    // Every /portal/auth/* call (request-code, verify-code, refresh) is excluded:
    // a 401 there is a real answer, not an expired session, and retrying it
    // would start a refresh loop.
    const isAuthEndpoint = originalRequest?.url?.includes("/portal/auth/");

    if (status !== 401 || !originalRequest || originalRequest._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken = getPortalRefreshToken();
    if (!refreshToken) {
      redirectToPortalLogin();
      return Promise.reject(error);
    }

    try {
      // Two parallel 401s share a single refresh call.
      if (!refreshPromise) {
        refreshPromise = axios
          .post(`${baseURL}/api/v1/portal/auth/refresh`, { refresh_token: refreshToken })
          .then((res) => {
            setPortalTokens(res.data);
            return res.data.access_token;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return portalClient(originalRequest);
    } catch (refreshError) {
      redirectToPortalLogin();
      return Promise.reject(refreshError);
    }
  },
);

export default portalClient;
