import React, { useState } from "react";
import Button from "../../components/Button";
import {
  useGetStoresQuery,
  useCreateStoreMutation,
  useUpdateStoresMutation,
  useDeleteStoreMutation,
  useGetStoreByIdQuery,
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


const StoreListPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(10);
  const { isDarkMode } = useTheme();

  const {
    data: storesResp = {
      data: [],
      meta: { total: 0, page: 1, perPage: 10, totalPages: 1 },
    },
    isLoading,
    refetch,
  } = useGetStoresQuery({ page, perPage, query });

  const [createStore, { isLoading: creatingLoading }] =
    useCreateStoreMutation();
  const [updateStore, { isLoading: updateLoading }] = useUpdateStoresMutation();
  const [deleteStore] = useDeleteStoreMutation();

  const { data: editingStoreData } = useGetStoreByIdQuery(editingStoreId!, {
    skip: !editingStoreId,
  });

  const stores = storesResp.data;
  const meta = storesResp.meta;
  const apiPageIndexBase = (meta.page - 1) * meta.perPage;

  const handleEdit = (storeId: string) => {
    setEditingStoreId(storeId);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteStore(id).unwrap();
    toast.success("Store deleted");
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
    { key: "street", label: "Street" },
    { key: "postcode", label: "Postcode" },
    { key: "companyName", label: "Company Name" },
    { key: "companyNumber", label: "Company Number" },
    {
      key: "actions",
      label: "Actions",
      render: (_value: unknown, row: Store) => (
        <div className="flex gap-2">
          <Link to={`/stores/${row.id}`} className="hover:underline">
            <ActionIcon
              className={isDarkMode ? "text-white" : "text-secondary-100"}
              icon={<EyeOpen size={22} />}
            />
          </Link>
          <ActionIcon
            icon={<EditIcon size={22} />}
            onClick={() => handleEdit(row.id)}
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
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h1 className="text-xl font-bold">Stores</h1>
        <Button
          onClick={() => {
            setEditingStoreId(null);
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


      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className=" rounded-lg shadow-sm">
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
          setEditingStoreId(null);
        }}
        onSubmit={async (values) => {
          if (editingStoreId) {
            await updateStore({ id: editingStoreId, data: values }).unwrap();
            toast.success("Store updated successfully");
          } else {
            await createStore(values).unwrap();
            toast.success("Store created successfully");
          }
          refetch();
          setModalOpen(false);
          setEditingStoreId(null);
        }}
        editingStore={editingStoreId ? editingStoreData : null}
        isSubmitting={creatingLoading || updateLoading}
      />
    </div>
  );
};

export default StoreListPage;
