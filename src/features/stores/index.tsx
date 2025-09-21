import React, { useState } from "react";
import Button from "../../components/Button";
import {
  useGetStoresQuery,
  useCreateStoreMutation,
  useUpdateStoresMutation,
  useDeleteStoreMutation,
} from "./services/storeApi";
import { type Column, DynamicTable } from "../../components/DynamicTable";
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
import { useServerTable } from "../../hooks/useServerTable";
import { toast } from "react-toastify";

const StoreListPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const {
    query,
    setQuery,
    setPage,
    setFilters,
    clearFilters,
    page,
    perPage,
    onPerPageChange,
    sort,
    setSort,
    queryParams,
  } = useServerTable();

  const {
    data: storesResp = {
      data: [],
      meta: { total: 0, page: 1, perPage: 10, totalPages: 1 },
    },
    isLoading,
  } = useGetStoresQuery(queryParams);

  const [createStore, { isLoading: creating }] = useCreateStoreMutation();
  const [updateStore, { isLoading: updating }] = useUpdateStoresMutation();
  const [deleteStore] = useDeleteStoreMutation();

  const stores = storesResp.data;
  const meta = storesResp.meta;
  const apiPageIndexBase = (meta.page - 1) * meta.perPage;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Partial<Store> | null>(null);

  // const handleEdit = (store: Store) => {
  //   let mappedDocuments: Record<string, any> = {};
  //   if (Array.isArray(store.storeDocuments)) {
  //     mappedDocuments = store.storeDocuments.reduce((acc: any, doc: any) => {
  //       acc[doc.documentTypeId] = {
  //         documentType: doc.documentTypeId,
  //         fileS3Key: doc.fileS3Key,
  //         signedUrl: doc.signedUrl,
  //         fileType: doc.fileType || "all",
  //         name: doc.name,
  //         expiresAt: doc.expiresAt,
  //         remindBeforeDays: doc.remindBeforeDays,
  //       };
  //       return acc;
  //     }, {});
  //   } else if (
  //     store.storeDocuments &&
  //     typeof store.storeDocuments === "object"
  //   ) {
  //     mappedDocuments = store.storeDocuments;
  //   }
  //   setEditingStore({ ...store, storeDocuments: mappedDocuments });
  //   setEditingStore({
  //     ...store,
  //     storeDocuments: mappedDocuments,
  //     storeAvailability: store.availabilityHour || store.storeAvailability || []
  //   });
  //   setModalOpen(true);
  // };
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

    setEditingStore({
      ...store,
      openingHours: store.availabilityHour || store.storeAvailability || []
    } as any);

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
      render: (_v, _row, index) => (
        <span>{apiPageIndexBase + (index ?? 0) + 1}</span>
      ),
    },
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Phone", sortable: true },
    { key: "city", label: "City", sortable: true },
    { key: "companyName", label: "Company Name", sortable: true },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
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

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <InputField
          className="w-72"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stores…"
          name="query"
        />
      </div>

      <div className="mb-8 mt-8">
        <FilterBar
          filtersConfig={storeFiltersConfig as any}
          onApplyFilters={setFilters}
          onClearAll={clearFilters}
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
              sort={sort}
              onSortChange={setSort}
            />
          </div>

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

      <StoreModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingStore(null);
        }}
        // onSubmit={async (values: any) => {
        //   if (editingStore) {
        //     await updateStore({ id: editingStore.id, data: values }).unwrap();
        //     toast.success("Store updated");
        //   } else {
        //     await createStore(values).unwrap();
        //     toast.success("Store created");
        //   }
        //   setModalOpen(false);
        //   setEditingStore(null);
        // }}
        onSubmit={async (values: any) => {
          const payload = {
            ...values,
            storeAvailability: values.openingHours,
          };

          if (editingStore) {
            await updateStore({ id: editingStore.id, data: payload }).unwrap();
            toast.success("Store updated");
          } else {
            await createStore(payload).unwrap();
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
