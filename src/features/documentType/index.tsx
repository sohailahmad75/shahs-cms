import React, { useState, useMemo } from "react";
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
import FilterBar from "../../components/FilterBar";
import { documentTypeFiltersConfig } from "./helpers/documentlist";

import {
  useGetDocumentsTypeQuery,
  useCreateDocumentsTypeMutation,
  useUpdateDocumentsTypeMutation,
  useDeleteDocumentsTypeMutation,
} from "./services/documentTypeApi";

const DocumentTypeListPage: React.FC = () => {
  const { isDarkMode } = useTheme();


  const [filters, setFilters] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);


  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: "asc" | "desc" | null }>({ key: null, direction: null });

  const queryParams = useMemo(() => {
    const params: Record<string, any> = { page, perPage };
    if (query) params.query = query;
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    if (sortConfig.key && sortConfig.direction) {
      params.sort = sortConfig.key;
      params.sortDir = sortConfig.direction.toUpperCase();
    }
    return params;
  }, [page, perPage, query, filters, sortConfig]);


  const {
    data: resp = {
      data: [],
      meta: { total: 0, page: 1, perPage: 10, totalPages: 1 }
    },
    isLoading,
    isFetching,
    refetch,
  } = useGetDocumentsTypeQuery(queryParams, {
    skip: !queryParams,
  });

  const documents = resp.data;
  const meta = resp.meta;
  const apiPageIndexBase = (meta.page - 1) * meta.perPage;

  const [createDocument, { isLoading: creating }] = useCreateDocumentsTypeMutation();
  const [updateDocument, { isLoading: updating }] = useUpdateDocumentsTypeMutation();
  const [deleteDocument] = useDeleteDocumentsTypeMutation();




  const [modalOpen, setModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<DocumentType | null>(null);

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
        <div className="flex items-center gap-3">
          <InputField
            className="w-72"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search documents…"
            name="query"
          />
        </div>
      </div>


      <div className="mb-8 mt-8">
        <FilterBar
          filtersConfig={documentTypeFiltersConfig as any}
          onApplyFilters={(appliedFilters) => {
            setFilters(appliedFilters);
            setPage(1);
          }}
          onClearAll={() => {
            setFilters({});
            setPage(1);
          }}
        />
      </div>

      {isLoading || isFetching ? (
        <Loader />
      ) : (
        <>
         
          <DynamicTable
            data={documents} 
            columns={columns.map(col => ({
              ...col,
              renderHeader: col.key !== "actions" && col.key !== "index"
                ? () => (
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => {
                      let direction: "asc" | "desc" | null = "asc";
                      if (sortConfig.key === col.key) {
                        if (sortConfig.direction === "asc") direction = "desc";
                        else if (sortConfig.direction === "desc") direction = null;
                      }
                      setSortConfig({ key: direction ? (col.key as string) : null, direction });
                      setPage(1); 
                    }}
                  >
                    {col.label}
                    <span className="text-xs">
                      {sortConfig.key === col.key
                        ? sortConfig.direction === "asc"
                          ? "▲"
                          : "▼"
                        : "▲▼"}
                    </span>
                  </div>
                )
                : undefined
            }))}
            rowKey="id"
          />


          <Pagination
            className="mt-4"
            page={page}
            perPage={perPage}
            total={meta.total}
            onPageChange={(p) => setPage(p)}
            onPerPageChange={(pp) => {
              setPerPage(pp);
              setPage(1);
            }}
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
        editingDocument={editingDocument as any}
        isSubmitting={creating || updating}
      />
    </div>
  );
};

export default DocumentTypeListPage;