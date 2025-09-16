import React, { useMemo, useState, useCallback } from "react";
import Button from "../../components/Button";
import { type Column, DynamicTable } from "../../components/DynamicTable";
import Loader from "../../components/Loader";
import ProductModal from "./components/ProductModal";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import EditIcon from "../../assets/styledIcons/EditIcon";
import TrashIcon from "../../assets/styledIcons/TrashIcon";
import EyeOpen from "../../assets/styledIcons/EyeOpen";
import ActionIcon from "../../components/ActionIcon";
import InputField from "../../components/InputField";
import Pagination from "../../components/Pagination";
import ConfirmDelete from "../../components/ConfirmDelete";
import FilterBar from "../../components/FilterBar";
import { useTheme } from "../../context/themeContext";

import { productFiltersConfig } from "./helper/product-list";
import type { Product } from "./product.types";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductsMutation,
  useDeleteProductMutation,
} from "./services/productApi";

type SortDir = "asc" | "desc" | null;

const useTableSort = () => {
  const [sort, setSort] = useState<{ key: string | null; direction: SortDir }>({
    key: null,
    direction: null,
  });
  const toggle = useCallback((key: string) => {
    setSort((prev) => {
      let direction: SortDir = "asc";
      if (prev.key === key) {
        direction =
          prev.direction === "asc"
            ? "desc"
            : prev.direction === "desc"
              ? null
              : "asc";
      }
      return { key: direction ? key : null, direction };
    });
  }, []);
  const indicator = useCallback(
    (key: string) =>
      sort.key === key ? (sort.direction === "asc" ? "▲" : "▼") : "▲▼",
    [sort],
  );
  return { sort, toggle, indicator };
};

const ProductListPage: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(10);
  const { isDarkMode } = useTheme();
  const { sort, toggle, indicator } = useTableSort();

  const queryParams = useMemo(() => {
    const params: Record<string, any> = { page, perPage };
    if (query) params.query = query;
    Object.entries(filters).forEach(([k, v]) => v && (params[k] = v));
    if (sort.key && sort.direction) {
      params.sort = sort.key;
      params.sortDir = sort.direction.toUpperCase();
    }
    return params;
  }, [page, perPage, query, filters, sort]);

  const {
    data: resp = {
      data: [],
      meta: { total: 0, page: 1, perPage: 10, totalPages: 1 },
    },
    isLoading,
  } = useGetProductsQuery(queryParams);

  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductsMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const products = resp.data as Product[];
  const meta = resp.meta;
  const apiPageIndexBase = (meta.page - 1) * meta.perPage;

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id).unwrap();
      toast.success("Product archived");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const columns: Column<Product>[] = [
    {
      key: "index",
      label: "#",
      render: (_v, _r, i) => <span>{apiPageIndexBase + (i ?? 0) + 1}</span>,
    },
    { key: "sku", label: "SKU" },
    { key: "name", label: "Name" },
    {
      key: "salesPrice",
      label: "Price",
      render: (v) => (typeof v === "number" ? `£${Number(v).toFixed(2)}` : "-"),
    },
    { key: "unit", label: "Unit" },
    {
      key: "isInventoryItem",
      label: "Type",
      render: (v) => (v ? "Stock" : "Service"),
    },
    {
      key: "isActive",
      label: "Status",
      render: (v) => (v ? "Active" : "Inactive"),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex gap-2">
          <Link to={`/products/${row.id}`} className="hover:underline">
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
            onConfirm={async () => handleDelete(row.id)}
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
        <h1 className="text-xl font-bold">Products</h1>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setModalOpen(true);
          }}
        >
          Add Product
        </Button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <InputField
            className="w-72"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search products…"
            name="query"
          />
        </div>
      </div>

      <div className="mb-8 mt-8">
        <FilterBar
          filtersConfig={productFiltersConfig as any}
          onApplyFilters={(applied) => {
            setFilters(applied);
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
              data={products}
              columns={columns.map((col) => ({
                ...col,
                renderHeader:
                  col.key !== "actions" && col.key !== "index"
                    ? () => (
                        <div
                          className="flex items-center gap-1 cursor-pointer"
                          onClick={() => toggle(col.key as string)}
                        >
                          {col.label}
                          <span className="text-xs">
                            {indicator(col.key as string)}
                          </span>
                        </div>
                      )
                    : undefined,
              }))}
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

      <ProductModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
        editingProduct={editingProduct ?? undefined}
        isSubmitting={creating || updating}
        onSubmit={async (values: Partial<Product>) => {
          if (editingProduct?.id) {
            await updateProduct({
              id: editingProduct.id,
              data: values,
            }).unwrap();
            toast.success("Product updated");
          } else {
            await createProduct(values).unwrap();
            toast.success("Product created");
          }
          setModalOpen(false);
          setEditingProduct(null);
        }}
      />
    </div>
  );
};

export default ProductListPage;
