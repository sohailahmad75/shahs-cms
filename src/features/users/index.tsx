import React, { useState, useMemo } from "react";
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
import ConfirmDelete from "../../components/ConfirmDelete";
import FilterBar from "../../components/FilterBar";
import { userFiltersConfig } from "./user-list";

import {
  useGetNewUsersQuery,
  useCreateUsersMutation,
  useUpdateUsersMutation,
  useDeleteUsersMutation,
} from "./services/UsersApi";
import EyeOpen from "../../assets/styledIcons/EyeOpen";

const UsersTypeListPage: React.FC = () => {
  const { isDarkMode } = useTheme();

  const [filters, setFilters] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<UserInfoTypes> | null>(null);


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

  // const { data: usersResponse, isLoading, refetch } = useGetUsersQuery(queryParams);
  const {
    data: usersResponse = {
      data: [],
      meta: { total: 0, page: 1, perPage: 10, totalPages: 1 },
    },
    isLoading,
    refetch,
  } = useGetNewUsersQuery(queryParams
  );

  const users = usersResponse?.data || [];
  const meta = usersResponse?.meta || { total: 0, page: 1, perPage: 10, totalPages: 1 };

  const [createUser, { isLoading: creating }] = useCreateUsersMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUsersMutation();
  const [deleteUser] = useDeleteUsersMutation();

  const apiPageIndexBase = (meta.page - 1) * meta.perPage;

  const handleEdit = (user: UsersType) => {
    console.log("📂 Raw user data:", user);

    let mappedDocuments: Record<string, any> = {};

    if (Array.isArray((user as any).userDocuments)) {
      mappedDocuments = (user as any).userDocuments.reduce((acc: any, doc: any) => {
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
    } else if (user.documents && typeof user.documents === "object") {
      mappedDocuments = user.documents;
    } else {
      mappedDocuments = {};
    }

    const mappedUser: Partial<UserInfoTypes> = {
      ...user,
      dateOfBirth: user.dateOfBirth,
      postcode: (user as any).postCode || user.postcode || "",
      niRate: (user as any).NiRate ?? user.niRate ?? null,
      type: user.role === UserRole.OWNER ? "owner" : "staff",
      documents: mappedDocuments,
      bankDetails: (user as any).bankDetails || user.bankDetails || [],
      availabilityHours: (user as any).availabilityHours || user.availabilityHours || [],
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

      {/* Search Bar */}
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

      {/* Filter Bar */}
      <div className="mb-8 mt-8">
        <FilterBar
          filtersConfig={userFiltersConfig as any}
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