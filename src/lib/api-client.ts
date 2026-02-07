import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { API_BASE_URL } from "@/config/constants";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { refreshToken, updateTokens, logout } = useAuthStore.getState();

      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      try {
        // Refresh token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
          expiresInMins: 1, // Extend session
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        updateTokens(accessToken, newRefreshToken);

        // Update header and retry
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
