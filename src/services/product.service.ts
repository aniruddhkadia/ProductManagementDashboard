import { apiClient } from "@/lib/api-client";
import type {
  Product,
  ProductListResponse,
  Category,
} from "@/types/product.types";

export const productService = {
  getAll: async (limit = 10, skip = 0) => {
    const response = await apiClient.get<ProductListResponse>("/products", {
      params: { limit, skip },
    });
    return response.data;
  },
  search: async (query: string, limit = 10, skip = 0) => {
    const response = await apiClient.get<ProductListResponse>(
      "/products/search",
      {
        params: { q: query, limit, skip },
      },
    );
    return response.data;
  },
  getByCategory: async (category: string, limit = 10, skip = 0) => {
    const response = await apiClient.get<ProductListResponse>(
      `/products/category/${category}`,
      {
        params: { limit, skip },
      },
    );
    return response.data;
  },
  getById: async (id: number) => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },
  getCategories: async () => {
    const response = await apiClient.get<Category[]>("/products/categories");
    return response.data;
  },
  add: async (data: Partial<Product>) => {
    const response = await apiClient.post<Product>("/products/add", data);
    return response.data;
  },
  update: async (id: number, data: Partial<Product>) => {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },
};
