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
import { Link } from "react-router-dom";
import InputField from "../../components/InputField";
import Pagination from "../../components/Pagination";
import EyeOpen from "../../assets/styledIcons/EyeOpen";

import {
  useGetUsersQuery,
  useCreateUsersMutation,
  useUpdateUsersMutation,
  useDeleteUsersMutation,
} from "./services/UsersApi";

const UsersTypeListPage: React.FC = () => {
  const { isDarkMode } = useTheme();

  // 🔹 Local state for pagination + search (like Stores page)
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(10);

  // 🔹 Fetch with params; default shape if API returns nothing yet
  const {
    data: usersResp = {
      data: [],
      meta: { total: 0, page: 1, perPage: 10, totalPages: 1 },
    },
    isLoading,
    refetch,
  } = useGetUsersQuery({ page, perPage, query });

  const users = usersResp.data;
  const meta = usersResp.meta;
  const apiPageIndexBase = (meta.page - 1) * meta.perPage;

  const [createUser, { isLoading: creating }] = useCreateUsersMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUsersMutation();
  const [deleteUser] = useDeleteUsersMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<UserInfoTypes> | null>(
    null,
  );

  const handleEdit = (user: UsersType) => {
    let mappedDocuments: Record<string, any> = {};

    if (Array.isArray((user as any).userDocuments)) {
      mappedDocuments = (user as any).userDocuments.reduce(
        (acc: any, doc: any) => {
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
        },
        {},
      );
    } else if (
      (user as any).documents &&
      typeof (user as any).documents === "object"
    ) {
      mappedDocuments = (user as any).documents;
    }

    const mappedUser: Partial<UserInfoTypes> = {
      ...user,
      dateOfBirth: user.dateOfBirth,
      postcode: (user as any).postCode || user.postcode || "",
      niRate: (user as any).NiRate ?? user.niRate ?? null,
      type: user.role === UserRole.OWNER ? "owner" : "staff",
      documents: mappedDocuments,
      bankDetails: (user as any).bankDetails || user.bankDetails || [],
      availabilityHours:
        (user as any).availabilityHours || user.availabilityHours || [],
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
      key: "index",
      label: "#",
      render: (_v: unknown, _row: UsersType, index?: number) => (
        <span>{apiPageIndexBase + (index ?? 0) + 1}</span>
      ),
    },
    {
      key: "firstName",
      label: "Name",
      render: (_, row) => `${row.firstName} ${row.surName || ""}`.trim(),
    },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "city", label: "City" },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex gap-2">
          <Link to={`/users/${row.id}`} className="hover:underline">
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
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
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

      {/* Toolbar (search) */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <InputField
            className="w-72"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search users…"
            name="query"
          />
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="rounded-lg shadow-sm">
            <DynamicTable
              data={users}
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

      <UsersTypeModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={async () => {
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
