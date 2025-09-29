import { useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../../components/Loader";
import { useTheme } from "../../../context/themeContext";
import { useGetUsersByIdQuery } from "../services/UsersApi";
import { DocumentIcon } from "@heroicons/react/24/solid";
import Modal from "../../../components/Modal";

interface Document {
    id: string;
    name: string;
    documentTypeId: string;
    expiresAt: string | null;
    signedUrl?: string;
}

const UserDocuments = () => {
    const { id } = useParams();
    const { data: user, isLoading } = useGetUsersByIdQuery(id!);
    const { isDarkMode } = useTheme();
    const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);
    const [previewName, setPreviewName] = useState<string>("");

    if (isLoading) return <Loader />;

    const documents: Document[] = (user?.userDocuments || []).map((doc: any) => ({
        id: String(doc.id),
        name: doc.name,
        documentTypeId: doc.documentTypeId,
        expiresAt: doc.expiresAt,
        signedUrl: doc.signedUrl ?? "",
    }));

    return (
        <div
            className={`p-4 sm:p-6 md:p-8 ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-gray-50 text-gray-800"
                } min-h-screen`}
        > <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center sm:text-left">
                User Documents </h2>
            {documents.length === 0 ? (
                <p className="text-gray-500 text-center">No documents uploaded.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className={`flex flex-col justify-between p-4 border rounded-lg shadow hover:shadow-lg transition-all duration-200 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <DocumentIcon
                                    className={`w-8 h-8 flex-shrink-0 ${isDarkMode ? "text-slate-400" : "text-gray-400"
                                        }`}
                                />
                                <div className="flex-1 overflow-hidden">
                                    <h3 className="font-semibold text-base truncate">{doc.name}</h3>
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
                                <button
                                    className={`mt-4 px-3 py-2 text-sm sm:text-base w-full ${isDarkMode
                                        ? "bg-slate-900 hover:bg-slate-950"
                                        : "bg-gray-400 hover:bg-gray-500"
                                        } text-white rounded`}
                                    onClick={() => {
                                        setPreviewDocUrl(doc.signedUrl!);
                                        setPreviewName(doc.name);
                                    }}
                                >
                                    Preview
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {previewDocUrl && (
                <Modal
                    isOpen={!!previewDocUrl}
                    onClose={() => {
                        setPreviewDocUrl(null);
                        setPreviewName("");
                    }}
                    title="Document Preview"
                    isDarkMode={isDarkMode}
                >
                    <div className="flex items-center justify-center w-full h-full">

                        <iframe
                            src={previewDocUrl}
                            className="w-full h-[70vh] rounded-lg"
                            title={previewName}
                        />
                    </div>
                </Modal>
            )}
        </div>


    );
};

export default UserDocuments;
