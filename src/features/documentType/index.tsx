import React, { useState } from "react";
import Button from "../../components/Button";
import { type Column, DynamicTable } from "../../components/DynamicTable";
import Loader from "../../components/Loader";
import DocumentTypeModal from "./components/documentTypeModal";
import EditIcon from "../../assets/styledIcons/EditIcon";
import TrashIcon from "../../assets/styledIcons/TrashIcon";
import ActionIcon from "../../components/ActionIcon";
import type { DocumentType } from "./documentTypes.types";
import { useTheme } from "../../context/themeContext";
import Pagination from "../../components/Pagination";
import FilterBar from "../../components/FilterBar";
import { documentTypeFiltersConfig } from "./helpers/documentlist";
import { useServerTable } from "../../hooks/useServerTable";

import {
  useGetDocumentsTypeQuery,
  useCreateDocumentsTypeMutation,
  useUpdateDocumentsTypeMutation,
  useDeleteDocumentsTypeMutation,
} from "./services/documentTypeApi";
import { toast } from "react-toastify";
import DebouncedSearch from "../../components/DebounceSerach";

const DocumentTypeListPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const {
    query,
    setQuery,
    setFilters,
    clearFilters,
    page,
    perPage,
    onPerPageChange,
    sort,
    setSort,
    setPage,
    queryParams,
  } = useServerTable();

  const {
    data: resp = {
      data: [],
      meta: { total: 0, page: 1, perPage: 10, totalPages: 1 },
    },
    isLoading,
    isFetching,
    refetch,
  } = useGetDocumentsTypeQuery(queryParams);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<DocumentType | null>(
    null,
  );

  const [createDocument, { isLoading: creating }] =
    useCreateDocumentsTypeMutation();
  const [updateDocument, { isLoading: updating }] =
    useUpdateDocumentsTypeMutation();
  const [deleteDocument] = useDeleteDocumentsTypeMutation();

  const documents = resp.data;
  const meta = resp.meta;
  const apiPageIndexBase = (meta.page - 1) * meta.perPage;

  const handleEdit = (doc: DocumentType) => {
    setEditingDocument(doc);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id).unwrap();
    } catch {
      toast.error("Failed to delete document");
      return;
    }
    toast.success("Document deleted successfully");
    refetch();
  };

  const columns: Column<DocumentType>[] = [
    {
      key: "index",
      label: "#",
      render: (_v, _row, index) => (
        <span>{apiPageIndexBase + (index ?? 0) + 1}</span>
      ),
    },
    { key: "name", label: "Document Name", sortable: true },
    { key: "description", label: "Description", sortable: true },
    {
      key: "createdAt",
      label: "Created At",
      sortable: true,
      sortKey: "createdAt",
      render: (_, row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleString() : "-",
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
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

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* <InputField
          className="w-72"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documents…"
          name="query"
        /> */}
        <DebouncedSearch
          value={query}
          onChange={(val) => setQuery(val)}
          delay={400}
          placeholder="Search documents…"
          className="w-100"
        />
      </div>

      <div className="mb-8 mt-8">
        <FilterBar
          filtersConfig={documentTypeFiltersConfig as any}
          onApplyFilters={setFilters}
          onClearAll={clearFilters}
        />
      </div>

      {isLoading || isFetching ? (
        <Loader />
      ) : (
        <>
          <DynamicTable
            data={documents}
            columns={columns}
            rowKey="id"
            tableClassName="bg-white"
            sort={sort}
            onSortChange={setSort}
          />

          <Pagination
            className="mt-4"
            page={page}
            perPage={perPage}
            total={meta.total}
            onPageChange={setPage}
            onPerPageChange={onPerPageChange}
            perPageOptions={[10, 25, 50]}
          />
        </>
      )}

      <DocumentTypeModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingDocument(null);
        }}
        onSubmit={async (values) => {
          try {
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
          } finally {
            setModalOpen(false);
            setEditingDocument(null);
          }
        }}
        editingDocument={editingDocument as any}
        isSubmitting={creating || updating}
      />
    </div>
  );
};

export default DocumentTypeListPage;
