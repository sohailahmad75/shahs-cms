import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { DownloadIcon } from "lucide-react";

interface Props {
  url: string;
  name?: string;
  onClose: () => void;
}

const DocumentPreviewModal: React.FC<Props> = ({
  url,
  name = "Document",
  onClose,
}) => {
  const getFileExtension = (url: string) => {
    try {
      const path = new URL(url).pathname;
      return path.split(".").pop()?.toLowerCase();
    } catch {
      return null;
    }
  };

  const ext = getFileExtension(url);
  const isImage = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext || "");
  const isPDF = ext === "pdf";
  const isOffice = ["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(
    ext || "",
  );
  const encodedUrl = encodeURIComponent(url);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg overflow-hidden relative">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {name}
          </h3>
          <div className="flex items-center gap-3">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
              title="Download"
            >
              <DownloadIcon className="w-5 h-5" />
            </a>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              title="Close"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Preview Body */}
        <div className="p-4 bg-gray-50 max-h-[80vh] overflow-y-auto">
          {isImage && (
            <img
              src={url}
              alt="Preview"
              className="max-w-full max-h-[70vh] object-contain mx-auto rounded"
            />
          )}

          {isPDF && (
            <iframe
              src={url}
              width="100%"
              height="600px"
              className="rounded border"
              title="PDF Viewer"
            />
          )}

          {isOffice && (
            <iframe
              src={`https://drive.google.com/viewerng/viewer?embedded=true&url=${encodedUrl}`}
              width="100%"
              height="600px"
              className="rounded border"
              title="Office Viewer"
            />
          )}

          {!isImage && !isPDF && !isOffice && (
            <p className="text-center text-gray-500">
              Unsupported file type for preview
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
