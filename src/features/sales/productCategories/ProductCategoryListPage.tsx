// src/features/products/ProductCategoryListPage.tsx
import React, { useMemo, useState } from "react";
import Button from "../../../components/Button";
import {
  DynamicTable,
  type Column,
  type SortDir,
} from "../../../components/DynamicTable";
import Loader from "../../../components/Loader";
import InputField from "../../../components/InputField";
import Pagination from "../../../components/Pagination";
import ConfirmDelete from "../../../components/ConfirmDelete";
import ActionIcon from "../../../components/ActionIcon";
import EditIcon from "../../../assets/styledIcons/EditIcon";
import TrashIcon from "../../../assets/styledIcons/TrashIcon";
import { toast } from "react-toastify";
import { useTheme } from "../../../context/themeContext";

import ProductCategoryModal from "./components/ProductCategoryModal";
import type { ProductCategory } from "./productCategory.types";
import {
  useGetProductCategoriesQuery,
  useCreateProductCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteProductCategoryMutation,
} from "./services/productCategoryApi";

const ProductCategoryListPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [sort, setSort] = useState<{ key: string | null; direction: SortDir }>({
    key: "createdAt",
    direction: "desc",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<ProductCategory> | null>(null);
  const { isDarkMode } = useTheme();

  const queryParams = useMemo(() => {
    const p: Record<string, any> = { page, perPage };
    if (query) p.query = query;
    if (sort.key && sort.direction) {
      p.sort = sort.key;
      p.sortDir = sort.direction.toUpperCase();
    }
    return p;
  }, [page, perPage, query, sort]);

  const {
    data: resp = {
      data: [],
      meta: { total: 0, page: 1, perPage: 10, totalPages: 1 },
    },
    isLoading,
  } = useGetProductCategoriesQuery(queryParams);

  const [createCategory, { isLoading: creating }] =
    useCreateProductCategoryMutation();
  const [updateCategory, { isLoading: updating }] =
    useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteProductCategoryMutation();
  const rows = resp.data as ProductCategory[];
  const meta = resp.meta;
  const apiPageIndexBase = (meta.page - 1) * meta.perPage;

  const columns: Column<ProductCategory>[] = [
    {
      key: "index",
      label: "#",
      render: (_v, _r, i) => <span>{apiPageIndexBase + (i ?? 0) + 1}</span>,
    },
    { key: "name", label: "Name", sortable: true },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (v) => (v ? new Date(v).toLocaleString() : "-"),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex gap-2">
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
          />
          <ConfirmDelete
            onConfirm={async () => {
              await deleteCategory(row.id).unwrap();
              toast.success("Category deleted");
            }}
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
        <h1 className="text-xl font-bold">Product Categories</h1>
        <Button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          Add Category
        </Button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <InputField
          className="w-72"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search categories…"
          name="query"
        />
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="rounded-lg shadow-sm">
            <DynamicTable
              data={rows}
              columns={columns}
              rowKey="id"
              tableClassName="bg-white"
              sort={sort}
              onSortChange={(next) => {
                setSort(next);
                setPage(1);
              }}
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

      <ProductCategoryModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        editingCategory={editing ?? undefined}
        isSubmitting={creating || updating}
        onSubmit={async (values) => {
          if (editing?.id) {
            await updateCategory({ id: editing.id, data: values }).unwrap();
            toast.success("Category updated");
          } else {
            await createCategory(values).unwrap();
            toast.success("Category created");
          }
          setModalOpen(false);
          setEditing(null);
        }}
      />
    </div>
  );
};

export default ProductCategoryListPage;
