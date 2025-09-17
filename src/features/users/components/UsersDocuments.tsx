import { useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../../components/Loader";
import { useTheme } from "../../../context/themeContext";
import { useGetUsersByIdQuery } from "../services/UsersApi";
import { XMarkIcon, DocumentIcon } from "@heroicons/react/24/solid";
import Button from "../../../components/Button";

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

    if (isLoading) return <Loader />;

    const documents: Document[] = (user?.userDocuments || []).map((doc: any) => ({
        id: String(doc.id),
        name: doc.name,
        documentTypeId: doc.documentTypeId,
        expiresAt: doc.expiresAt,
        signedUrl: doc.signedUrl ?? "",
    }));

    return (
        <div className={`p-6 ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-gray-50 text-gray-800"} min-h-screen`}>
            <h2 className="text-2xl font-bold mb-6">User Documents</h2>

            {documents.length === 0 ? (
                <p className="text-gray-500">No documents uploaded.</p>
            ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className={`flex flex-col justify-between p-4 border rounded-lg shadow hover:shadow-lg transition-all duration-200
                            ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
                        >
                            <div className="flex items-center space-x-3">
                                <DocumentIcon className={`w-8 h-8 ${isDarkMode ? "text-slate-950" : "text-orange-500"}`} />

                                <div className="flex-1">
                                    <h3 className="font-semibold">{doc.name}</h3>
                                    <p className="text-sm text-gray-400">
                                        Type: {doc.documentTypeId}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Expires: {doc.expiresAt ? new Date(doc.expiresAt).toLocaleDateString() : "N/A"}
                                    </p>
                                </div>
                            </div>
                            {doc.signedUrl && (
                                <Button
                                    className={`mt-4 px-4 py-2 `}
                                    onClick={() => setPreviewDocUrl(doc.signedUrl)}
                                >
                                    Preview
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            )}


            {previewDocUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl w-[90%] max-w-4xl h-[80%] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-slate-700">
                            <h3 className="text-lg font-semibold">Document Preview</h3>
                            <button
                                onClick={() => setPreviewDocUrl(null)}
                                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                            >
                                <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-200" />
                            </button>
                        </div>
                        <iframe
                            src={previewDocUrl}
                            title="Document Preview"
                            className="flex-1 w-full border-none rounded-b-xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDocuments;

