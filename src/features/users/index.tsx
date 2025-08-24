import React, { useState } from "react";
import Button from "../../components/Button";
import { type Column, DynamicTable } from "../../components/DynamicTable";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import UsersTypeModal from "./components/UsersModal";
import EditIcon from "../../assets/styledIcons/EditIcon";
import TrashIcon from "../../assets/styledIcons/TrashIcon";
import ActionIcon from "../../components/ActionIcon";
import { UserRole, type UserInfoTypes, type UsersType } from "./users.types";
import { useTheme } from "../../context/themeContext";

import {
  useGetUsersQuery,
  useCreateUsersMutation,
  useUpdateUsersMutation,
  useDeleteUsersMutation,
} from "./services/UsersApi";
const UsersTypeListPage: React.FC = () => {
  const { isDarkMode } = useTheme();

  const { data: usersResponse, isLoading, refetch } = useGetUsersQuery();
  const users = usersResponse?.data || []; 

  const [createUser, { isLoading: creating }] = useCreateUsersMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUsersMutation();
  const [deleteUser] = useDeleteUsersMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<UserInfoTypes> | null>(null);
  const handleEdit = (user: UsersType) => {
  const mappedUser: Partial<UserInfoTypes> = {
    ...user,
    dob: user.dateOfBirth || user.dob || "",
    dateOfBirth: undefined, 
    postcode: (user as any).postCode || user.postcode || "",
    niRate: (user as any).NiRate ?? user.niRate ?? null,
    type: user.role === UserRole.OWNER ? "owner" : "staff",
  };

  setEditingUser(mappedUser);
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

  const columns: Column<UsersType>[] = [
  { 
    key: "firstName", 
    label: "Name",
    render: (_, row) => `${row.firstName} ${row.surName || ''}`.trim(),
  },
  { 
    key: "email",
    label: "Email",
  },
  { 
    key: "phone",
    label: "Phone",
  },
  { 
    key: "city",
    label: "City",
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
          onClick={() => row.id && handleDelete(row.id)}
        />
      </div>
    ),
  },
];


  return (
    <div className="p-4">
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