import React, { useCallback, useState } from "react";
import { type Accept, useDropzone } from "react-dropzone";
import { useGetPresignedUrlMutation } from "../services/menuApi";
import {
  ArrowUpTrayIcon,
  XMarkIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { uploadToS3 } from "../helper";
import { useGetPresignedStoreDocUrlMutation } from "../services/documentApi";
import { useGetAllMutation } from "../features/users/services/UsersApi";

interface FileUploaderProps {
  /** The S3 key */
  value: string;
  /**
   * onChange can be used in two ways:
   *  - onChange(key)
   *  - onChange(key, fileName)
   */
  onChange: (key: string, fileName?: string) => void;
  /** Type of file to upload */
  type?: "image" | "file" | "all";
  /** Upload path "menu-categories" | "menu-items" | "menu-banner" | "menu-modifier-options" | "store-documents" | "users-documents" */
  path: string;
  /** Signed URL (or any URL) to show initial preview for edit mode */
  initialPreview?: string;

  error?: string | null;
  /** e.g., storeId when path === "store-documents" */
  pathId?: string;

  /** size preset: 1 = small, 4 = extra large */
  size?: 1 | 2 | 3 | 4;
  fit?: "cover" | "contain";
}

const SIZE_PRESETS = {
  1: {
    height: "h-20 sm:h-24 md:h-28",
    icon: "w-5 h-5",
    font: "text-xs",
    padding: "p-2 sm:p-3 md:p-4",
  },
  2: {
    height: "h-32 sm:h-36 md:h-45",
    icon: "w-6 h-6",
    font: "text-sm",
    padding: "p-3",
  },
  3: {
    height: "h-32 sm:h-40 md:h-48",
    icon: "w-8 h-8",
    font: "text-base",
    padding: "p-4",
  },
  4: {
    height: "h-40 sm:h-56 md:h-64",
    icon: "w-10 h-10",
    font: "text-lg",
    padding: "p-5",
  },
} as const;

const FileUploader: React.FC<FileUploaderProps> = ({
  value,
  onChange,
  type = "image",
  path,
  initialPreview,
  error,
  pathId,
  size = 2,
  fit = "cover",
}) => {
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [getPresignedUrl] = useGetPresignedUrlMutation();
  const [getPresignedStoreDocUrl] = useGetPresignedStoreDocUrlMutation();
  const [getPresignedAll] = useGetAllMutation();

  const { height, icon, font, padding } = SIZE_PRESETS[size];

  const isImageType = (fileType: string) => fileType.startsWith("image/");

  const getPreviewSource = () => {
    if (localPreviewUrl) return localPreviewUrl; // new uploaded preview
    if (initialPreview) return initialPreview; // passed preview (signed URL)
    return null;
    // If neither, and value holds a non-image key, we show a doc icon + filename.
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);

      const isImage = isImageType(file.type);
      if (isImage) {
        const localUrl = URL.createObjectURL(file);
        setLocalPreviewUrl(localUrl);
        setFileName(null);
      } else {
        setFileName(file.name);
        setLocalPreviewUrl(null);
      }

      try {
        let presigned: { url: string; key: string };

        switch (path) {
          case "menu-categories":
          case "menu-items":
          case "menu-banner":
          case "menu-modifier-options":
            presigned = await getPresignedUrl({
              fileName: file.name,
              fileType: file.type,
              path,
            }).unwrap();
            break;

          case "store-documents":
            if (!pathId) {
              const errorMessage =
                "Store ID is required for store document uploads.";
              toast.error(errorMessage);
              throw new Error(errorMessage);
            }
            presigned = await getPresignedStoreDocUrl({
              fileName: file.name,
              fileType: file.type,
              storeId: pathId,
            }).unwrap();
            break;

          case "users-documents":
            presigned = await getPresignedAll({
              fileName: file.name,
              fileType: file.type,
            }).unwrap();
            break;

          default:
            throw new Error(`Unsupported path: ${path}`);
        }

        await uploadToS3(presigned.url, file);

        toast.success("File uploaded successfully");
        // Support both onChange signatures: (key) and (key, fileName)
        onChange(presigned.key, file.name);
      } catch (err) {
        console.error(err);
        setLocalPreviewUrl(null);
        setFileName(null);
        onChange("", "");
      } finally {
        setIsUploading(false);
      }
    },
    [
      getPresignedStoreDocUrl,
      getPresignedUrl,
      getPresignedAll,
      onChange,
      path,
      pathId,
    ]
  );

  const removeFile = () => {
    if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    setLocalPreviewUrl(null);
    setFileName(null);
    onChange("", "");
  };

  // const acceptedTypes: Accept =
  //   type === "image"
  //     ? { "image/*": [".jpeg", ".jpg", ".png", ".webp"] }
  //     : { "*/*": [] };


  const acceptedTypes: Accept =
    type === "image"
      ? {
        "image/jpeg": [".jpeg", ".jpg"],
        "image/png": [".png"],
        "image/webp": [".webp"]
      }
      : {};


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const previewSrc = getPreviewSource();
  const fitClass = `object-${fit}`;

  return (
    <>
      <div className={`relative w-full ${height}`}>
        {value ? (
          <div
            className={`absolute inset-0 group border rounded-md ${padding} bg-gray-50`}
          >
            {previewSrc ? (
              <img
                src={previewSrc}
                alt="Uploaded Preview"
                className={`w-full h-full ${fitClass} rounded-lg`}
              />
            ) : (
              <div className={`w-full h-full flex items-center gap-2 ${font}`}>
                <DocumentIcon className={`${icon} text-gray-500`} />
                <span className="text-gray-700 break-all">
                  {fileName || initialPreview?.split("/").pop() || "File uploaded"}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={removeFile}
              className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 shadow-sm cursor-pointer"
            >
              <XMarkIcon className={`text-red-500 ${icon}`} />
            </button>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`absolute inset-0 border-2 border-dashed rounded-lg ${padding} text-center cursor-pointer transition-colors ${error
                ? "border-red-500 bg-red-50"
                : isDragActive
                  ? "border-orange-100 bg-orange-05"
                  : "border-gray-300 hover:border-orange-100"
              }`}
          >
            <input {...getInputProps()} />
            {isUploading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader className={icon} />
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className={`mx-auto ${icon} text-gray-400 mb-2`}>
                  <ArrowUpTrayIcon />
                </div>
                <p className={`${font} text-gray-600`}>
                  {isDragActive
                    ? "Drop here"
                    : `Drag & drop a ${type} here, or click to select`}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Max. 10MB {type === "image" ? " (JPG, PNG, WEBP)" : ""}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </>
  );
};

export default FileUploader;
