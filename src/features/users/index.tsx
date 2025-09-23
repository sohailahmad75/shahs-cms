import React, { useState } from "react";
import Button from "../../components/Button";
import { type Column, DynamicTable } from "../../components/DynamicTable";
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
import ConfirmDelete from "../../components/ConfirmDelete";
import FilterBar from "../../components/FilterBar";
import { userFiltersConfig } from "./user-list";
import { useServerTable } from "../../hooks/useServerTable";
import { toast } from "react-toastify";

import {
  useGetNewUsersQuery,
  useCreateUsersMutation,
  useUpdateUsersMutation,
  useDeleteUsersMutation,
} from "./services/UsersApi";

const UsersTypeListPage: React.FC = () => {
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
    data: usersResponse = {
      data: [],
      meta: { total: 0, page: 1, perPage: 10, totalPages: 1 },
    },
    isLoading,
    refetch,
  } = useGetNewUsersQuery(queryParams);

  const users = usersResponse?.data || [];
  const meta = usersResponse?.meta || {
    total: 0,
    page: 1,
    perPage: 10,
    totalPages: 1,
  };
  const apiPageIndexBase = (meta.page - 1) * meta.perPage;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<UserInfoTypes> | null>(
    null,
  );
  const [createUser, { isLoading: creating }] = useCreateUsersMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUsersMutation();
  const [deleteUser] = useDeleteUsersMutation();

  const handleEdit = (user: UsersType) => {
    let mappedDocuments: Record<string, any> = {};
    if (Array.isArray((user as any).userDocuments)) {
      mappedDocuments = (user as any).userDocuments.reduce(
        (acc: any, doc: any) => {
          acc[doc.documentTypeId] = {
            id: doc.id,
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
      render: (_v, _row, index) => (
        <span>{apiPageIndexBase + (index ?? 0) + 1}</span>
      ),
    },
    {
      key: "firstName",
      label: "Name",
      sortable: true,
      render: (_, row) => `${row.firstName} ${row.surName || ""}`.trim(),
    },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Phone", sortable: true },
    { key: "city", label: "City", sortable: true },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
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
          <ConfirmDelete
            onConfirm={async () => row.id && handleDelete(row.id)}
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
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <InputField
          className="w-72"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users…"
          name="query"
        />
      </div>

      <div className="mb-8 mt-8">
        <FilterBar
          filtersConfig={userFiltersConfig as any}
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
              data={users}
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

      <UsersTypeModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={async () => {
          await refetch();
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
