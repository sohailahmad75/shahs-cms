import React from "react";
import Button from "../../../components/Button";
import {
  DynamicTable,
  type Column,
} from "../../../components/DynamicTable";
import Loader from "../../../components/Loader";
import Pagination from "../../../components/Pagination";
import ActionIcon from "../../../components/ActionIcon";
import EditIcon from "../../../assets/styledIcons/EditIcon";
import { toast } from "react-toastify";
import { useTheme } from "../../../context/themeContext";

import ProductCategoryModal from "./components/ProductCategoryModal";
import type { ProductCategory } from "./productCategory.types";
import {
  useGetProductCategoriesQuery,
  useCreateProductCategoryMutation,
  useUpdateCategoryMutation,
} from "./services/productCategoryApi";
import FilterBar from "../../../components/FilterBar";
import { productCategoryFiltersConfig } from "./helpers/CategoriesFilters";
import { useServerTable } from "../../../hooks/useServerTable";
import DebouncedSearch from "../../../components/DebounceSerach";

const ProductCategoryListPage: React.FC = () => {
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

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Partial<ProductCategory> | null>(null);

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

   
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <DebouncedSearch
          value={query}
          onChange={setQuery}
          delay={400}
          placeholder="Search categories…"
          className="w-100"
        />
      </div>


      <div className="mb-8 mt-8">
        <FilterBar
          filtersConfig={productCategoryFiltersConfig as any}
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
            onPageChange={setPage}
            onPerPageChange={onPerPageChange}
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