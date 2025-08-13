import React, { useState, useMemo } from "react";
import Button from "../../components/Button";
import {
  useGetStoresQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
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
import InputField from "../../components/InputField"; // Add a search input component

const ITEMS_PER_PAGE = 10;

const StoreListPage: React.FC = () => {
  const {
    data: storesResp = {
      data: [],
      meta: { total: 0, page: 1, perPage: 10, totalPages: 0 },
    },
    isLoading,
    refetch,
  } = useGetStoresQuery();

  console.log("storesResp:", storesResp);
  const [createStore, { isLoading: creatingLoading }] =
    useCreateStoreMutation();
  const [updateStore, { isLoading: updateLoading }] = useUpdateStoreMutation();
  const [deleteStore] = useDeleteStoreMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: editingStoreData } = useGetStoreByIdQuery(editingStoreId!, {
    skip: !editingStoreId,
  });

  const handleEdit = (storeId: string) => {
    setEditingStoreId(storeId);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStore(id).unwrap();
      toast.success("Store deleted");
      refetch();
    } catch (err: any) {
      toast.error("Failed to delete store");
    }
  };
  const columns: Column<Store>[] = [
    {
      key: "index",
      label: "#",
      render: (_value: unknown, _row: Store, index?: number) => (
        <span>{(page - 1) * ITEMS_PER_PAGE + (index || 0) + 1}</span>
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
              className="text-secondary-100"
              icon={<EyeOpen size={22} />}
            />
          </Link>
          <ActionIcon
            icon={<EditIcon size={22} />}
            onClick={() => handleEdit(row.id)}
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
        <h1 className="text-2xl font-bold">Stores</h1>
        <Button
          onClick={() => {
            setEditingStoreId(null);
            setModalOpen(true);
          }}
        >
          Add Store
        </Button>
      </div>

      <div className="mb-4 flex justify-between">
        <InputField
          className="w-72"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search"
          name={""}
        />
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <DynamicTable
            data={storesResp.data}
            columns={columns}
            rowKey="id"
            tableClassName="bg-white"
          />

          {/* Pagination controls */}
          {/* <div className="mt-4 flex justify-end items-center gap-2">
            <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
             <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
          </div> */}
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Page {page} of {storesResp.meta.totalPages || 1}
            </span>
            <div className="flex gap-2">
              <Button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                disabled={page >= (storesResp.meta.totalPages || 1)}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
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
