import { useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../../components/Loader";
import { useTheme } from "../../../context/themeContext";
import { useGetStoreByIdQuery } from "../services/storeApi";
import { DocumentIcon } from "@heroicons/react/24/solid";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";

interface Document {
  id: string;
  name: string;
  documentTypeId: string;
  expiresAt: string | null;
  signedUrl?: string;
}

const StoreDocuments = () => {
  const { id } = useParams();
  const { data: store, isLoading } = useGetStoreByIdQuery(id!);
  const { isDarkMode } = useTheme();
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);

  if (isLoading) return <Loader />;

  // Handle different formats of storeDocuments (array, object, or undefined)
  const rawDocuments = store?.storeDocuments;
  const normalizedDocs = Array.isArray(rawDocuments)
    ? rawDocuments
    : rawDocuments && typeof rawDocuments === "object"
      ? Object.values(rawDocuments)
      : [];

  const documents: Document[] = normalizedDocs.map((doc: any) => ({
    id: doc.id || crypto.randomUUID(),
    name: doc.name || "Unnamed Document",
    documentTypeId: doc.documentTypeId || "Unknown Type",
    expiresAt: doc.expiresAt || null,
    signedUrl: doc.signedUrl || doc.fileUrl || "",
  }));

  return (
    <div
      className={`p-4 sm:p-6 md:p-8 ${isDarkMode
          ? "bg-slate-900 text-slate-100"
          : "bg-gray-50 text-gray-800"
        } min-h-screen`}
    >
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center sm:text-left">
        Store Documents
      </h2>

      {documents.length === 0 ? (
        <p className="text-gray-500 text-center">No documents uploaded.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`flex flex-col justify-between p-4 border rounded-lg shadow hover:shadow-lg transition-all duration-200
              ${isDarkMode
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white border-gray-200"
                }`}
            >
              <div className="flex items-center space-x-3">
                <DocumentIcon
                  className={`w-8 h-8 flex-shrink-0 ${isDarkMode ? "text-slate-400" : "text-orange-500"
                    }`}
                />
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-semibold text-base truncate">
                    {doc.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 truncate">
                    Type: {doc.documentTypeId}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Expires:{" "}
                    {doc.expiresAt
                      ? new Date(doc.expiresAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
              {doc.signedUrl && (
                <Button
                  className="mt-4 px-3 py-2 text-sm sm:text-base w-full"
                  onClick={() => setPreviewDocUrl(doc.signedUrl!)}
                >
                  Preview
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {previewDocUrl && (
        <Modal
          isOpen={!!previewDocUrl}
          onClose={() => setPreviewDocUrl(null)}
          title="Document Preview"
          isDarkMode={isDarkMode}
        >
          <div className="flex items-center justify-center w-full h-full">
            <img
              src={previewDocUrl}
              alt="Document Preview"
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StoreDocuments;