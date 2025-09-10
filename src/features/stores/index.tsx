import React, { useMemo, useState } from "react";
import Button from "../../components/Button";
import {
  useGetStoresQuery,
  useCreateStoreMutation,
  useUpdateStoresMutation,
  useDeleteStoreMutation,
} from "./services/storeApi";
import { type Column, DynamicTable } from "../../components/DynamicTable";
import { toast } from "react-toastify";
import type { Store } from "./store.types";
import Loader from "../../components/Loader";
import StoreModal from "./components/StoreModal";
import { Link } from "react-router-dom";
import EditIcon from "../../assets/styledIcons/EditIcon";
import ActionIcon from "../../components/ActionIcon";
import TrashIcon from "../../assets/styledIcons/TrashIcon";
import EyeOpen from "../../assets/styledIcons/EyeOpen";
import InputField from "../../components/InputField";
import Pagination from "../../components/Pagination";
import ConfirmDelete from "../../components/ConfirmDelete";
import { useTheme } from "../../context/themeContext";
import FilterBar from "../../components/FilterBar";
import { storeFiltersConfig } from "./helper/store-list";

const StoreListPage: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Partial<Store> | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(10);
  const { isDarkMode } = useTheme();

  // ✅ Memoized query params (important for RTK Query)
  const queryParams = useMemo(() => {
    const params: { page?: number; perPage?: number; query?: string;[key: string]: any } = {};
    params.page = page;
    params.perPage = perPage;

    if (query) params.query = query;

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });

    return params;
  }, [page, perPage, query, filters]);

  const {
    data: storesResp = {
      data: [],
      meta: { total: 0, page: 1, perPage: 10, totalPages: 1 },
    },
    isLoading,
  } = useGetStoresQuery(queryParams, {
    skip: !queryParams, 
  });

  const [createStore, { isLoading: creating }] = useCreateStoreMutation();
  const [updateStore, { isLoading: updating }] = useUpdateStoresMutation();
  const [deleteStore] = useDeleteStoreMutation();

  const stores = storesResp.data;
  const meta = storesResp.meta;
  const apiPageIndexBase = (meta.page - 1) * meta.perPage;

  const handleEdit = (store: Store) => {
    let mappedDocuments: Record<string, any> = {};

    if (Array.isArray(store.storeDocuments)) {
      mappedDocuments = store.storeDocuments.reduce((acc: any, doc: any) => {
        acc[doc.documentTypeId] = {
          documentType: doc.documentTypeId,
          fileS3Key: doc.fileS3Key,
          signedUrl: doc.signedUrl,
          fileType: doc.fileType || "all",
          name: doc.name,
          expiresAt: doc.expiresAt,
          remindBeforeDays: doc.remindBeforeDays,
        };
        return acc;
      }, {});
    } else if (store.storeDocuments && typeof store.storeDocuments === "object") {
      mappedDocuments = store.storeDocuments;
    }

    const mappedStore: Partial<Store> = {
      ...store,
      storeDocuments: mappedDocuments,
    };

    setEditingStore(mappedStore);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStore(id).unwrap();
      toast.success("Store deleted successfully");
    } catch {
      toast.error("Failed to delete store");
    }
  };

  const columns: Column<Store>[] = [
    {
      key: "index",
      label: "#",
      render: (_v: unknown, _row: Store, index?: number) => (
        <span>{apiPageIndexBase + (index ?? 0) + 1}</span>
      ),
    },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "city", label: "City" },
    { key: "companyName", label: "Company Name" },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex gap-2">
          <Link to={`/stores/${row.id}`} className="hover:underline">
            <ActionIcon
              className={isDarkMode ? "text-white" : "text-secondary-100"}
              icon={<EyeOpen size={22} />}
            />
          </Link>
          <ActionIcon
            icon={<EditIcon size={22} />}
            onClick={() => handleEdit(row)}
            className={
              isDarkMode
                ? "text-slate-400 hover:text-slate-200"
                : "text-gray-500 hover:text-gray-700"
            }
          />
          <ConfirmDelete
            onConfirm={async () => handleDelete(row.id)}
            renderTrigger={({ open }) => (
              <ActionIcon
                className="text-red-500"
                icon={<TrashIcon size={22} />}
                onClick={open}
                title="Delete"
              />
            )}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h1 className="text-xl font-bold">Stores</h1>
        <Button
          onClick={() => {
            setEditingStore(null);
            setModalOpen(true);
          }}
        >
          Add Store
        </Button>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <InputField
            className="w-72"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search stores…"
            name="query"
          />
        </div>
      </div>

     
      <div className="mb-8 mt-8">
        <FilterBar
          filtersConfig={storeFiltersConfig as any}
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

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="rounded-lg shadow-sm">
            <DynamicTable
              data={stores}
              columns={columns}
              rowKey="id"
              tableClassName="bg-white"
            />
          </div>

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

      <StoreModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingStore(null);
        }}
        onSubmit={async (values: any) => {
          if (editingStore) {
            await updateStore({
              id: editingStore.id,
              data: values,
            }).unwrap();
            toast.success("Store updated");
          } else {
            await createStore(values).unwrap();
            toast.success("Store created");
          }
          setModalOpen(false);
          setEditingStore(null);
        }}
        editingStore={editingStore}
        isSubmitting={creating || updating}
      />
    </div>
  );
};

export default StoreListPage;