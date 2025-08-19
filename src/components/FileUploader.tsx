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

interface FileUploaderProps {
  value: string; // The s3 key
  onChange: (key: string) => void;
  type?: "image" | "file" | "all"; // Type of file to upload
  path: string;
  initialPreview?: string;
  error?: string | null;
  pathId?: string; // Optional, used for a store path, user path, etc. stores/${storeId}/documents
}

const FileUploader: React.FC<FileUploaderProps> = ({
  value,
  onChange,
  type = "image",
  path,
  initialPreview,
  error,
  pathId,
}) => {
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [getPresignedUrl] = useGetPresignedUrlMutation();
  const [getPresignedStoreDocUrl] = useGetPresignedStoreDocUrlMutation();

  const isImageType = (fileType: string) => fileType.startsWith("image/");

  // Handle preview image display logic
  const getPreviewSource = () => {
    if (localPreviewUrl) return localPreviewUrl; // New uploaded preview
    if (initialPreview) return initialPreview; // Signed URL passed for edit
    return null;
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
      } else {
        setFileName(file.name);
        setLocalPreviewUrl(null);
      }

      try {
        let presigned;

        switch (path) {
          case "menu-categories":
          case "menu-items":
          case "menu-banner":
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

          default:
            throw new Error(`Unsupported path: ${path}`);
        }

        await uploadToS3(presigned.url, file);

        toast.success("File uploaded successfully");
        onChange(presigned.key);
      } catch (err) {
        // toast.error("File upload failed");
        console.error(err);
        setLocalPreviewUrl(null);
        setFileName(null);
        onChange("");
      } finally {
        setIsUploading(false);
      }
    },
    [getPresignedUrl, onChange, path],
  );

  const removeFile = () => {
    if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    setLocalPreviewUrl(null);
    setFileName(null);
    onChange("");
  };

  const acceptedTypes: Accept =
    type === "image"
      ? { "image/*": [".jpeg", ".jpg", ".png", ".webp"] }
      : { "*/*": [] };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const previewSrc = getPreviewSource();
  return (
    <>
      {value ? (
        <div className="relative group border rounded-md p-2 bg-gray-50">
          {previewSrc ? (
            <img
              src={previewSrc}
              alt="Uploaded Preview"
              className="w-full h-60 object-cover rounded-lg"
            />
          ) : (
            <div className="flex items-center gap-2">
              <DocumentIcon className="w-6 h-6 text-gray-500" />
              <span className="text-sm text-gray-700 break-all">
                {fileName ||
                  initialPreview?.split("/").pop() ||
                  "File uploaded"}
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={removeFile}
            className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 shadow-sm cursor-pointer"
          >
            <XMarkIcon className="w-5 h-5 text-red-500" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            error
              ? "border-red-500 bg-red-50"
              : isDragActive
                ? "border-orange-100 bg-orange-05"
                : "border-gray-300 hover:border-orange-100"
          }`}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader className="h-26" />
            </div>
          ) : (
            <>
              <div className="mx-auto h-10 w-10 text-gray-400 mb-2">
                <ArrowUpTrayIcon />
              </div>
              <p className="text-sm text-gray-600">
                {isDragActive
                  ? "Drop here"
                  : `Drag & drop a ${type} here, or click to select`}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Max. 10MB {type === "image" ? " (JPG, PNG, WEBP)" : ""}
              </p>
            </>
          )}
        </div>
      )}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </>
  );
};

export default FileUploader;
