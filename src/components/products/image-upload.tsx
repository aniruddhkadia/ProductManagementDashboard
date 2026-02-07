import { useState, useRef } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { uploadService } from "@/services/upload.service";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  multiple = false,
  label,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const images = Array.isArray(value) ? value : value ? [value] : [];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setProgress(0);

    try {
      const uploadPromises = Array.from(files).map((file) =>
        uploadService.uploadImage(file, (p) => setProgress(p)),
      );

      const urls = await Promise.all(uploadPromises);

      if (multiple) {
        onChange([...images, ...urls]);
      } else {
        onChange(urls[0]);
      }
      toast.success("Upload successful");
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setIsUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (urlToRemove: string) => {
    if (multiple) {
      onChange(images.filter((url) => url !== urlToRemove));
    } else {
      onChange("");
    }
  };

  return (
    <div className="space-y-4 w-full">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="flex flex-wrap gap-4">
        {images.map((url) => (
          <div
            key={url}
            className="relative w-32 h-32 rounded-lg overflow-hidden border"
          >
            <img
              src={url}
              alt="Uploaded"
              className="object-cover w-full h-full"
            />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute top-1 right-1 p-1 bg-destructive rounded-full text-destructive-foreground hover:bg-destructive/90 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {(!multiple && images.length === 0) || multiple ? (
          <div
            className="w-32 h-32 rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors relative"
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="text-[10px] font-medium">{progress}%</span>
              </div>
            ) : (
              <>
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-[10px] mt-2 text-muted-foreground">
                  Upload
                </span>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              multiple={multiple}
              onChange={handleUpload}
              disabled={isUploading}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
