import React, { useState } from "react";
import {
  useGetDocumentsQuery,
  usePostDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useGetDocumentByIdQuery,
} from "../../../services/documentApi";
import { toast } from "react-toastify";
import type { Document } from "../../../types/document.types";
import Button from "../../../components/Button";
import { type Column, DynamicTable } from "../../../components/DynamicTable";
import Loader from "../../../components/Loader";
import DocumentModal from "./DocumentModal";
import ActionIcon from "../../../components/ActionIcon";
import { DownloadIcon, TrashIcon } from "lucide-react";
import EditIcon from "../../../assets/styledIcons/EditIcon";
import { useParams } from "react-router-dom";
import EyeOpen from "../../../assets/styledIcons/EyeOpen";
import { XMarkIcon } from "@heroicons/react/24/outline";
import DocumentPreviewModal from "./DocumentPreviewModal";

const StoreDocuments: React.FC = () => {
  const { id } = useParams();
  const {
    data: documents = [],
    isLoading,
    refetch,
  } = useGetDocumentsQuery({
    storeId: id,
  });

  const [createDocument, { isLoading: creating }] = usePostDocumentMutation();
  const [updateDocument, { isLoading: updating }] = useUpdateDocumentMutation();
  const [deleteDocument] = useDeleteDocumentMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { data: editingDoc } = useGetDocumentByIdQuery(editingId!, {
    skip: !editingId,
  });

  const handleDelete = async (id: string) => {
    await deleteDocument(id).unwrap();
    toast.success("Document deleted");
    refetch();
  };
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "file">("file");
  const handlePreview = (doc: Document) => {
    setPreviewUrl(doc.signedUrl);

    // Auto-detect if it's image or not
    const isImage = doc.signedUrl?.match(/\.(jpeg|jpg|png|webp)$/i);
    setPreviewType(isImage ? "image" : "file");
  };
  const columns: Column<Document>[] = [
    { key: "name", label: "Name" },
    {
      key: "documentType",
      label: "Type",
      render: (_, row) =>
        row.documentType ? (
          <span className="capitalize">{row?.documentType}</span>
        ) : (
          "—"
        ),
    },
    {
      key: "expiresAt",
      label: "Expiry Date",
      render: (_, row) =>
        row.expiresAt ? new Date(row.expiresAt).toLocaleDateString() : "—",
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex gap-2">
          <ActionIcon
            icon={<EyeOpen size={22} />}
            onClick={() => handlePreview(row)}
          />
          <a
            href={`${row.signedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ActionIcon icon={<DownloadIcon size={22} />} />
          </a>
          <ActionIcon
            icon={<EditIcon size={22} />}
            onClick={() => {
              setEditingId(row.id);
              setModalOpen(true);
            }}
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
      <div className="flex justify-end items-center mb-6">
        <Button
          onClick={() => {
            setEditingId(null);
            setModalOpen(true);
          }}
        >
          Add Document
        </Button>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <DynamicTable
          data={documents}
          columns={columns}
          rowKey="id"
          tableClassName="bg-white"
        />
      )}

      <DocumentModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingId(null);
        }}
        onSubmit={async (values) => {
          if (editingId) {
            await updateDocument({
              id: editingId,
              data: { ...values, storeId: id },
            }).unwrap();
            toast.success("Updated successfully");
          } else {
            await createDocument({ ...values, storeId: id }).unwrap();
            toast.success("Created successfully");
          }
          refetch();
          setModalOpen(false);
          setEditingId(null);
        }}
        editingDocument={editingId ? editingDoc : null}
        isSubmitting={creating || updating}
      />
      {previewUrl && (
        <DocumentPreviewModal
          url={previewUrl}
          name="Document"
          onClose={() => setPreviewUrl(null)}
        />
      )}
    </div>
  );
};

export default StoreDocuments;
