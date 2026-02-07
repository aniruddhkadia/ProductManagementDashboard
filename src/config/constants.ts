export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://dummyjson.com";

export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "",
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "",
};

export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/",
  PRODUCTS: "/products",
  USERS: "/users",
  SETTINGS: "/settings",
};
