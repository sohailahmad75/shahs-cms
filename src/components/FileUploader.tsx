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
  value: string;
  onChange: (key: string, fileName?: string) => void;
  type?: "image" | "file" | "all";
  path: string;
  initialPreview?: string;
  error?: string | null;
  pathId?: string;
  size?: 1 | 2 | 3 | 4;
  fit?: "cover" | "contain";
}

const SIZE_PRESETS = {
  1: { height: "h-20 sm:h-24 md:h-28", icon: "w-5 h-5", font: "text-xs", padding: "p-2 sm:p-3 md:p-4" },
  2: { height: "h-32 sm:h-36 md:h-45", icon: "w-6 h-6", font: "text-sm", padding: "p-3" },
  3: { height: "h-32 sm:h-40 md:h-48", icon: "w-8 h-8", font: "text-base", padding: "p-4" },
  4: { height: "h-40 sm:h-56 md:h-64", icon: "w-10 h-10", font: "text-lg", padding: "p-5" },
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

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);

      const isImage = isImageType(file.type);
      if (isImage) {
        const localUrl = URL.createObjectURL(file);
        setLocalPreviewUrl(localUrl);
        setFileName(file.name);
      } else {
        setFileName(file.name);
        setLocalPreviewUrl(URL.createObjectURL(file));
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
            if (!pathId) throw new Error("Store ID is required for store document uploads.");
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
    [getPresignedStoreDocUrl, getPresignedUrl, getPresignedAll, onChange, path, pathId]
  );

  const removeFile = () => {
    if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    setLocalPreviewUrl(null);
    setFileName(null);
    onChange("", "");
  };

  const acceptedTypes: Accept =
    type === "image"
      ? {
        "image/jpeg": [".jpeg", ".jpg"],
        "image/png": [".png"],
        "image/webp": [".webp"],
      }
      : {};

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, 
  });

  const fitClass = `object-${fit}`;


  const renderPreview = () => {
    const src = localPreviewUrl || initialPreview;
    const name = fileName || initialPreview?.split("/").pop() || "File uploaded";

    if (!src) return null;

    if (name.endsWith(".pdf")) {
      return (
        <iframe
          src={src}
          className="w-full h-full rounded-lg"
          title="PDF Preview"
        />
      );
    }

    if (name.endsWith(".xls") || name.endsWith(".xlsx")) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <DocumentIcon className={`${icon} text-green-600`} />
          <span className="text-gray-700 text-sm mt-2">{name}</span>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline text-xs mt-1"
          >
            Open Excel
          </a>
        </div>
      );
    }

  
    return (
      <img
        src={src}
        alt="Uploaded Preview"
        className={`w-full h-full ${fitClass} rounded-lg`}
      />
    );
  };

  return (
    <>
      <div className={`relative w-full ${height}`}>
        {value ? (
          <div
            className={`absolute inset-0 group border rounded-md ${padding} bg-gray-50`}
          >
            {renderPreview()}

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
