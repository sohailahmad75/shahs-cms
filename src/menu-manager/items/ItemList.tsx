import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../../components/Button";
import { type Column, DynamicTable } from "../../components/DynamicTable";
import Loader from "../../components/Loader";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import Pagination from "../../components/Pagination";
import AddIcon from "../../assets/styledIcons/AddIcon";
import AddItemModal from "./AddItemModal";
import {
  useGetMenuItemsQuery,
  useGetMenuCategoryNamesQuery,
  useDeleteMenuItemMutation,
} from "../../services/menuApi";
import { MenuItem } from "../menu.types";
import ActionIcon from "../../components/ActionIcon";
import EyeOpen from "../../assets/styledIcons/EyeOpen";
import EditIcon from "../../assets/styledIcons/EditIcon";
import TrashIcon from "../../assets/styledIcons/TrashIcon";
import { toast } from "react-toastify";
import { useDeleteStoreMutation } from "../../features/stores/services/storeApi";

const ItemList: React.FC = () => {
  const { id: menuId = "" } = useParams();

  // UI state (same pattern as Stores page)
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [categoryId, setCategoryId] = useState<string>("All");
  const [showAddItem, setShowAddItem] = useState(false);

  // Fetch items (server-side pagination + search + optional category)
  const {
    data: itemsResp = {
      data: [],
      meta: { total: 0, page: 1, perPage: 10, totalPages: 1 },
    },
    isLoading,
    isFetching,
    refetch,
  } = useGetMenuItemsQuery({
    menuId,
    page,
    perPage,
    query,
    categoryId: categoryId !== "All" ? categoryId : undefined,
  });

  // Fetch categories (id + name only)
  const { data: categoryNames = [], isLoading: categoriesLoading } =
    useGetMenuCategoryNamesQuery(menuId, { skip: !menuId });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const items = itemsResp.data as MenuItem[];
  const meta = itemsResp.meta;
  const apiPageIndexBase = (meta.page - 1) * meta.perPage;
  const [deleteMenuItem] = useDeleteMenuItemMutation();

  // Options for the category dropdown
  const categoryOptions = useMemo(
    () => [{ id: "All", name: "All" }, ...categoryNames],
    [categoryNames],
  );

  // Flatten image/category label for table
  const tableData = useMemo(() => {
    return items.map((i) => ({
      ...i,
      image: i.signedUrl || "",
      categoryLabel: i.category?.name || i.categoryName || "Uncategorized",
    }));
  }, [items]);

  const columns: Column<(typeof tableData)[number]>[] = [
    {
      key: "index",
      label: "#",
      render: (_v, _row, index) => (
        <span>{apiPageIndexBase + (index ?? 0) + 1}</span>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (value: unknown, row) => (
        <div className="flex items-center gap-3">
          {row.image ? (
            <img
              src={row.image}
              alt={row.name}
              className="w-10 h-10 rounded object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded bg-gray-100" />
          )}
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (v: unknown) => <span>£{Number(v).toFixed(2)}</span>,
    },
    {
      key: "categoryLabel",
      label: "Category",
      render: (value: unknown) => (
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
          {value}
        </span>
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (_, row: MenuItem) => (
        <div className="flex gap-2">
          <ActionIcon
            icon={<EditIcon size={22} />}
            onClick={() => handleEdit(row.id)}
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

  const handleEdit = (storeId: string) => {
    setEditingItemId(storeId);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteMenuItem({ itemId: id, menuId }).unwrap();
    toast.success("Menu Item deleted");
  };
  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Menu Items</h1>
        <Button
          onClick={() => setShowAddItem(true)}
          className="w-full sm:w-auto"
          icon={<AddIcon />}
        >
          Add Item
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <InputField
            className="w-72"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search items…"
            name="query"
          />
          <SelectField
            name="category"
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(1);
            }}
            options={categoryOptions.map((c) => ({
              label: c.name,
              value: c.id,
            }))}
            disabled={categoriesLoading}
          />
        </div>
      </div>

      {/* Content */}
      {isLoading || isFetching ? (
        <Loader />
      ) : items.length === 0 ? (
        <div className="border border-dashed rounded-lg p-8 text-center text-gray-600 bg-white">
          No items found.
          {query || categoryId !== "All" ? (
            <span className="block text-sm text-gray-500 mt-1">
              Try adjusting your search or category filter.
            </span>
          ) : (
            <span className="block text-sm text-gray-500 mt-1">
              Click <strong>Add Item</strong> to create your first one.
            </span>
          )}
        </div>
      ) : (
        <>
          <div className="rounded-lg shadow-sm">
            <DynamicTable
              data={tableData}
              columns={columns}
              rowKey="id"
              tableClassName="bg-white text-sm"
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

      <AddItemModal
        isOpen={showAddItem}
        onClose={() => setShowAddItem(false)}
        categories={categoryOptions
          .filter((c) => c.id !== "All")
          .map((c) => ({ id: c.id, name: c.name }))}
        selectedCategory={{ id: "", name: "" }}
        // onSubmitSuccess={() => refetch()}
      />
    </div>
  );
};

export default ItemList;
