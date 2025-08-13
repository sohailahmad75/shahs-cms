import React, { useState } from "react";
import Button from "../../components/Button";
import { type Column, DynamicTable } from "../../components/DynamicTable";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import DocumentTypeModal from "./components/documentTypeModal";
import EditIcon from "../../assets/styledIcons/EditIcon";
import TrashIcon from "../../assets/styledIcons/TrashIcon";
import ActionIcon from "../../components/ActionIcon";
import type { DocumentType } from "./documentTypes.types";
import { useTheme } from "../../context/themeContext";

import {
  useGetDocumentsQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
} from "./services/documentsApi";

const DocumentTypeListPage: React.FC = () => {
  const { isDarkMode } = useTheme();

  const { data: documents = [], isLoading, refetch } = useGetDocumentsQuery();
  const [createDocument, { isLoading: creating }] = useCreateDocumentMutation();
  const [updateDocument, { isLoading: updating }] = useUpdateDocumentMutation();
  const [deleteDocument] = useDeleteDocumentMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<DocumentType | null>(
    null
  );

  const handleEdit = (doc: DocumentType) => {
    setEditingDocument(doc);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id).unwrap();
      toast.success("Document deleted successfully");
      refetch();
    } catch {
      toast.error("Failed to delete document");
    }
  };

  const columns: Column<DocumentType>[] = [
    { key: "id", label: "ID" },
    { key: "documentName", label: "Document Name" },
    { key: "description", label: "Description" },
    {
      key: "created",
      label: "Created At",
      render: (_, row) =>
        row.created ? new Date(row.created).toLocaleString() : "-",
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex gap-2">
          <ActionIcon
            icon={<EditIcon size={22} />}
            onClick={() => handleEdit(row)}
            className={
              isDarkMode
                ? "text-slate-400 hover:text-slate-200"
                : "text-gray-500 hover:text-gray-700"
            }
          />
          <ActionIcon
            className="text-red-500"
            icon={<TrashIcon size={22} />}
            onClick={() => handleDelete(row.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Documents</h1>
        <Button
          onClick={() => {
            setEditingDocument(null);
            setModalOpen(true);
          }}
        >
          Add Document
        </Button>
      </div>

      {isLoading ? (
        <Loader />
      ) 
       : (
        <DynamicTable
          data={documents}
          columns={columns}
          rowKey="id"
          tableClassName="bg-white dark:bg-slate-900"
        />
      )}

      <DocumentTypeModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingDocument(null);
        }}
        onSubmit={async (values) => {
          if (editingDocument) {
            await updateDocument({
              id: editingDocument.id,
              data: values,
            }).unwrap();
            toast.success("Document updated");
          } else {
            await createDocument(values).unwrap();
            toast.success("Document created");
          }
          refetch();
          setModalOpen(false);
          setEditingDocument(null);
        }}
        editingDocument={editingDocument}
        isSubmitting={creating || updating}
      />
    </div>
  );
};

export default DocumentTypeListPage;
