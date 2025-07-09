import React, { useState } from "react";
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
import type { Store } from "./types";
import Loader from "../../components/Loader";
import StoreModal from "./components/StoreModal";
import { Link, useNavigate } from "react-router-dom";
import EditIcon from "../../assets/styledIcons/EditIcon";
import ActionIcon from "../../components/ActionIcon";
import { DeleteIcon } from "lucide-react";
import TransactionIcon from "../../assets/styledIcons/TransactionIcon";
import TrashIcon from "../../assets/styledIcons/TrashIcon";
import EyeOpen from "../../assets/styledIcons/EyeOpen";

const StoreListPage: React.FC = () => {
  const { data: stores = [], isLoading, refetch } = useGetStoresQuery();
  const [createStore, { isLoading: creatingLoading }] =
    useCreateStoreMutation();
  const [updateStore, { isLoading: updateLoading }] = useUpdateStoreMutation();
  const [deleteStore] = useDeleteStoreMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const navigate = useNavigate();
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
      render: (_, __, index) => <span>{index + 1}</span>,
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
      render: (_, row) => (
        <div className="flex gap-2">
          <Link to={`/stores/${row.id}`} className="hover:underline ">
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

      {isLoading ? (
        <Loader />
      ) : (
        <DynamicTable
          data={stores}
          columns={columns}
          rowKey="id"
          tableClassName="bg-white dark:bg-slate-900"
        />
      )}

      <StoreModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingStoreId(null);
        }}
        onSubmit={async (values) => {
          try {
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
          } catch (err: any) {
            toast.error(err?.data?.message || "Error occurred");
          }
        }}
        editingStore={editingStoreData || null}
        isSubmitting={creatingLoading || updateLoading}
      />
    </div>
  );
};

export default StoreListPage;
