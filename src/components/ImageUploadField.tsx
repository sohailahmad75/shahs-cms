import React, { useRef, useState } from "react";
import { useGetPresignedUrlMutation } from "../services/documentApi";
import { uploadToS3 } from "../helper";
import CameraIcon from "../assets/styledIcons/CameraIcon";

interface Props {
  value?: string;
  onChange: (fileKey: string) => void;
}

const ImageUploadField: React.FC<Props> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [getPresignedUrl] = useGetPresignedUrlMutation();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const { url, key, method } = await getPresignedUrl({
        fileName: file.name,
        fileType: file.type,
        ownerId: "123",
        ownerType: "store",
      }).unwrap();

      await uploadToS3(url, method, file);
      onChange(key); // send only fileKey to backend
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/*{label && <span className="text-sm">{label}</span>}*/}

      <div
        className="relative w-28 h-28 rounded-full border overflow-hidden group hover:opacity-80 cursor-pointer border-1 border-orange-100"
        onClick={() => inputRef.current?.click()}
      >
        {preview || value ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 bg-gray-100">
            No image
          </div>
        )}

        <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center opacity-0 group-hover:opacity-90 transition">
          <CameraIcon color="white" />
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleFileSelect}
        disabled={uploading}
      />
    </div>
  );
};

export default ImageUploadField;
