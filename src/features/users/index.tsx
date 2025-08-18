import React, { useState } from "react";
import Button from "../../components/Button";
import { type Column, DynamicTable } from "../../components/DynamicTable";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import UsersTypeModal from "./components/UsersModal";
import EditIcon from "../../assets/styledIcons/EditIcon";
import TrashIcon from "../../assets/styledIcons/TrashIcon";
import ActionIcon from "../../components/ActionIcon";
import type { UsersType } from "./users.types";
import { useTheme } from "../../context/themeContext";

import {
  useGetDocumentsQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
} from "./services/UsersApi";

const UsersTypeListPage: React.FC = () => {
  const { isDarkMode } = useTheme();

  const { data: users = [], isLoading, refetch } = useGetDocumentsQuery();
  const [createUser, { isLoading: creating }] = useCreateDocumentMutation();
  const [updateUser, { isLoading: updating }] = useUpdateDocumentMutation();
  const [deleteUser] = useDeleteDocumentMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UsersType | null>(null);

  const handleEdit = (user: UsersType) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted successfully");
      refetch();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case "staff":
        return "Staff";
      case "store_owner":
        return "Store Owner";
      default:
        return userType;
    }
  };

  const columns: Column<UsersType>[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    {
      key: "userType",
      label: "User Type",
      render: (_, row) => getUserTypeLabel(row.userType),
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
        <h1 className="text-xl font-bold">Users</h1>
        <Button
          onClick={() => {
            setEditingUser(null);
            setModalOpen(true);
          }}
        >
          Add User
        </Button>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <DynamicTable
          data={users}
          columns={columns}
          rowKey="id"
          tableClassName="bg-white dark:bg-slate-900"
        />
      )}

      <UsersTypeModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={async (values: any) => {
          if (editingUser) {
            await updateUser({
              id: editingUser.id,
              data: values,
            }).unwrap();
            toast.success("User updated");
          } else {
            await createUser(values).unwrap();
            toast.success("User created");
          }
          refetch();
          setModalOpen(false);
          setEditingUser(null);
        }}
        editingUsers={editingUser}
        isSubmitting={creating || updating}
      />
    </div>
  );
};

export default UsersTypeListPage;
