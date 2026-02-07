import { apiClient } from "@/lib/api-client";
import type { UserListResponse } from "@/types/user.types";

export const userService = {
  getAll: async (limit = 0, skip = 0) => {
    const response = await apiClient.get<UserListResponse>("/users", {
      params: { limit, skip },
    });
    return response.data;
  },
};
