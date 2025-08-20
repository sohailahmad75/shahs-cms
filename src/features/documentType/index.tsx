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
import InputField from "../../components/InputField";
import Pagination from "../../components/Pagination";

import {
  useGetDocumentsTypeQuery,
  useCreateDocumentsTypeMutation,
  useUpdateDocumentsTypeMutation,
  useDeleteDocumentsTypeMutation,
} from "./services/documentTypeApi";

const DocumentTypeListPage: React.FC = () => {
  const { isDarkMode } = useTheme();

  // State for pagination and search
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
6
  // API call with pagination params
  const {
    data: resp = { data: [], meta: { total: 0, page: 1, perPage: 10, totalPages: 1 } },
    isLoading,
    isFetching,
    refetch,
  } = useGetDocumentsTypeQuery({ page, perPage, search });

  const documents = resp.data;
  const meta = resp.meta;
  const apiPageIndexBase = (meta.page - 1) * meta.perPage;

  const [createDocument, { isLoading: creating }] = useCreateDocumentsTypeMutation();
  const [updateDocument, { isLoading: updating }] = useUpdateDocumentsTypeMutation();
  const [deleteDocument] = useDeleteDocumentsTypeMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<DocumentType | null>(
    null,
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
    {
      key: "index",
      label: "#",
      render: (_v, _row, index) => <span>{apiPageIndexBase + (index ?? 0) + 1}</span>,
    },
    { key: "name", label: "Document Name" },
    { key: "description", label: "Description" },
    {
      key: "createdAt",
      label: "Created At",
      render: (_, row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleString() : "-",
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
        <h1 className="text-xl font-bold">Documents</h1>
        <Button
          onClick={() => {
            setEditingDocument(null);
            setModalOpen(true);
          }}
        >
          Add Document Type
        </Button>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <InputField
            className="w-72"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset to first page on search
            }}
            placeholder="Search documents…"
            name="search"
          />
        </div>
      </div>

      {/* Table / Loader / Empty */}
      {isLoading || isFetching ? (
        <Loader />
      ) : (
        <DynamicTable
          data={documents}
          columns={columns}
          rowKey="id"
          tableClassName="bg-white dark:bg-slate-900"
        />
      )}

      {/* Modal */}
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
            toast.success("Document Type updated");
          } else {
            await createDocument(values).unwrap();
            toast.success("Document Type created");
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
