import { apiClient } from "@/lib/api-client";
import type { AuthResponse, LoginRequest } from "@/types/auth.types";

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    return response.data;
  },
};
