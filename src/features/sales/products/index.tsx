import React, { useState } from "react";
import Button from "../../../components/Button";
import {
  type Column,
  DynamicTable,

} from "../../../components/DynamicTable";
import Loader from "../../../components/Loader";
import { Link } from "react-router-dom";
import EditIcon from "../../../assets/styledIcons/EditIcon";
import EyeOpen from "../../../assets/styledIcons/EyeOpen";
import ActionIcon from "../../../components/ActionIcon";
import Pagination from "../../../components/Pagination";
import FilterBar from "../../../components/FilterBar";
import { useTheme } from "../../../context/themeContext";
import { productFiltersConfig } from "./helper/product-list";
import type { Product } from "./product.types";
import {
  useGetProductsQuery,
} from "./services/productApi";
import { StockStatsHeader } from "./components/StatItem";
import ProductDrawerManager from "./components/ProductModal";
import { useServerTable } from "../../../hooks/useServerTable";
import DebouncedSearch from "../../../components/DebounceSerach";

const ProductListPage: React.FC = () => {
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

  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeStat, setActiveStat] = useState<"LOW" | "OUT" | null>(null);

  const {
    data: resp = {
      data: [],
      meta: { total: 0, page: 1, perPage: 10, totalPages: 1 },
    },
    isLoading,
  } = useGetProductsQuery(queryParams);

  const products = resp.data as Product[];
  const meta = resp.meta;
  const apiPageIndexBase = (meta.page - 1) * meta.perPage;

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setIsDrawerOpen(true);
  };

  const handleChange = (next: "LOW" | "OUT" | null) => {
    setActiveStat(next);
    if (next === "LOW") {
      setFilters((f: any) => ({ ...f, stockStatus: "LOW" }));
      setPage(1);
    } else if (next === "OUT") {
      setFilters((f: any) => ({ ...f, stockStatus: "OUT" }));
      setPage(1);
    } else {
      setFilters(({ stockStatus, ...rest }: any) => rest);
    }
  };

  const columns: Column<Product>[] = [
    {
      key: "index",
      label: "#",
      render: (_v, _r, i) => <span>{apiPageIndexBase + (i ?? 0) + 1}</span>,
    },
    { key: "name", label: "Name", sortable: true },
    { key: "usage", label: "Usage" },
    {
      key: "itemCode",
      label: "Item Code",
      sortable: true
    },
    {
      key: "createdAt",
      label: "Created At",
      sortable: true,
      render: (v) => {
        if (v === null || v === undefined || typeof v === "boolean") return "-";
        const d = new Date(v as string | number | Date);
        return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
      },
    },
    {
      key: "productType",
      label: "Type",
      render: (v) => {
        if (v === "stock") return "Stock";
        if (v === "non-stock") return "Non-Stock";
        if (v === "service") return "Service";
        return "-";
      },
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
            setIsDrawerOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Product
        </Button>
      </div>

      <StockStatsHeader
        lowCount={21}
        outCount={32}
        activeStat={activeStat}
        onChange={handleChange}
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <DebouncedSearch
          value={query}
          onChange={(val) => setQuery(val)}
          delay={400}
          placeholder="Search products…"
          className="w-100"
        />
      </div>

      <div className="mb-8 mt-8">
        <FilterBar
          filtersConfig={productFiltersConfig as any}
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
              data={products}
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

      {isDrawerOpen && (
        <ProductDrawerManager
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setEditingProduct(null);
          }}
          editingProduct={editingProduct || undefined}
        />
      )}
    </div>
  );
};

export default ProductListPage;