import React, { useState } from "react";
import {
  useGetDocumentsQuery,
  useCreateDocumentMutation,
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

const StoreDocuments: React.FC = () => {
  const {
    data: documents = [],
    isLoading,
    refetch,
  } = useGetDocumentsQuery({
    ownerType: "store",
  });

  const [createDocument, { isLoading: creating }] = useCreateDocumentMutation();
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

  const columns: Column<Document>[] = [
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
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
          <a
            href={`https://your-s3-bucket-url/${row.fileS3Key}`}
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
            await updateDocument({ id: editingId, data: values }).unwrap();
            toast.success("Updated successfully");
          } else {
            await createDocument(values).unwrap();
            toast.success("Created successfully");
          }
          refetch();
          setModalOpen(false);
          setEditingId(null);
        }}
        editingDocument={editingId ? editingDoc : null}
        isSubmitting={creating || updating}
        defaultOwnerType="store"
      />
    </div>
  );
};

export default StoreDocuments;
