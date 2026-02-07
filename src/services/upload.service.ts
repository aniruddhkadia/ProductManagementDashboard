import axios from "axios";
import { CLOUDINARY_CONFIG } from "@/config/constants";

export const uploadService = {
  uploadImage: async (
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<string> => {
    // Basic validation (also handled by browser input but good to have here)
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only jpg, png, and webp images are allowed");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Image size must be less than 5MB");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);

    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;

    try {
      const response = await axios.post(url, formData, {
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            onProgress(percentCompleted);
          }
        },
      });

      return response.data.secure_url;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || error.message;
      console.error("Cloudinary Upload Error:", message);
      throw new Error(`Upload failed: ${message}`);
    }
  },
};
