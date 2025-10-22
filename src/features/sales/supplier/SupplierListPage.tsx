import React, { useState } from "react";
import Button from "../../../components/Button";
import {
  DynamicTable,
  type Column,

} from "../../../components/DynamicTable";
import Loader from "../../../components/Loader";
import Pagination from "../../../components/Pagination";
import ConfirmDelete from "../../../components/ConfirmDelete";
import ActionIcon from "../../../components/ActionIcon";
import EditIcon from "../../../assets/styledIcons/EditIcon";
import TrashIcon from "../../../assets/styledIcons/TrashIcon";
import EyeOpen from "../../../assets/styledIcons/EyeOpen"; 
import { toast } from "react-toastify";
import { useTheme } from "../../../context/themeContext";
import type { Supplier } from "./Supplier.types";
import {
  useGetAllSupplierQuery,
  useCreateOneSupplierMutation,
  useUpdateOneSupplierMutation,
  useDeleteOneSupplierMutation
} from "./services/SupplierApi";
import SupplierModal from "./components/SuuplierModal";
import DebouncedSearch from "../../../components/DebounceSerach";
import FilterBar from "../../../components/FilterBar";
import { useServerTable } from "../../../hooks/useServerTable";
import { supplierFiltersConfig } from "./filtersHelpers";
import { Link } from "react-router-dom"; 

const SupplierListPage: React.FC = () => {
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

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Supplier> | null>(null);

  const {
    data: resp = {
      data: [],
      meta: { total: 0, page: 1, perPage: 10, totalPages: 1 },
    },
    isLoading,
  } = useGetAllSupplierQuery(queryParams);

  const [createSupplier, { isLoading: creating }] = useCreateOneSupplierMutation();
  const [updateSupplier, { isLoading: updating }] = useUpdateOneSupplierMutation();
  const [deleteSupplier] = useDeleteOneSupplierMutation();

  const rows = resp.data as Supplier[];
  const meta = resp.meta;
  const apiPageIndexBase = (meta.page - 1) * meta.perPage;

  const columns: Column<Supplier>[] = [
    {
      key: "index",
      label: "#",
      render: (_v, _r, i) => <span>{apiPageIndexBase + (i ?? 0) + 1}</span>,
    },
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Phone", sortable: true },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (status) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${status === "active"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
            }`}
        >
          {status === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created Date",
      sortable: true,
      render: (value) =>
        typeof value === "string" ? new Date(value).toLocaleDateString() : "",
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex gap-2">
          <Link to={`/sales/suppliers/${row.id}`} className="hover:underline">
            <ActionIcon
              className={isDarkMode ? "text-white" : "text-secondary-100"}
              icon={<EyeOpen size={22} />}
              title="View Supplier"
            />
          </Link>

          <ActionIcon
            icon={<EditIcon size={22} />}
            onClick={() => {
              setEditing(row);
              setModalOpen(true);
            }}
            className={
              isDarkMode
                ? "text-slate-400 hover:text-slate-200"
                : "text-gray-500 hover:text-gray-700"
            }
            title="Edit Supplier"
          />
          <ConfirmDelete
            onConfirm={async () => {
              await deleteSupplier(row.id).unwrap();
              toast.success("Supplier deleted");
            }}
            renderTrigger={({ open }) => (
              <ActionIcon
                className="text-red-500"
                icon={<TrashIcon size={22} />}
                onClick={open}
                title="Delete Supplier"
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
        <h1 className="text-xl font-bold">Suppliers</h1>
        <Button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          Add Supplier
        </Button>
      </div>


      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <DebouncedSearch
          value={query}
          onChange={(val) => setQuery(val)}
          delay={400}
          placeholder="Search suppliers…"
          className="w-100"
        />
      </div>

      <div className="mb-8 mt-8">
        <FilterBar
          filtersConfig={supplierFiltersConfig as any}
          onApplyFilters={setFilters}
          onClearAll={clearFilters}
        />
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="rounded-lg shadow-sm border border-gray-200">
            <DynamicTable
              data={rows}
              columns={columns}
              rowKey="id"

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

      <SupplierModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        editingSupplier={editing ?? undefined}
        isSubmitting={creating || updating}
        onSubmit={async (values) => {
          if (editing?.id) {
            await updateSupplier({ id: editing.id, data: values }).unwrap();
            toast.success("Supplier updated successfully");
          } else {
            await createSupplier(values).unwrap();
            toast.success("Supplier created successfully");
          }
          setModalOpen(false);
          setEditing(null);
        }}
      />
    </div>
  );
};

export default SupplierListPage;