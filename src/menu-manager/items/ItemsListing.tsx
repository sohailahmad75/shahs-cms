// src/pages/menu/MenuItemsTable.tsx
import React, { useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Button from "../../components/Button";
import { type Column, DynamicTable } from "../../components/DynamicTable";
import Loader from "../../components/Loader";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import Pagination from "../../components/Pagination";
import AddIcon from "../../assets/styledIcons/AddIcon";
import EditIcon from "../../assets/styledIcons/EditIcon";
import TrashIcon from "../../assets/styledIcons/TrashIcon";
import ActionIcon from "../../components/ActionIcon";
import { toast } from "react-toastify";

import {
  useGetMenuItemsQuery,
  useGetMenuCategoryNamesQuery,
  useDeleteMenuItemMutation,
} from "../../services/menuApi";
import ItemModal from "../../menu-manager/items/ItemModal";
import type { MenuItem } from "../../menu-manager/menu.types";
import ConfirmDelete from "../../components/ConfirmDelete";

const ItemsListing: React.FC = () => {
  const { id: menuId = "" } = useParams();

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [categoryId, setCategoryId] = useState<string>("All");

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Items (server-side pagination/search/category filter)
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

  // Categories (for filter + create/edit modal)
  const { data: categoryNames = [], isLoading: categoriesLoading } =
    useGetMenuCategoryNamesQuery(menuId, { skip: !menuId });

  const [deleteMenuItem, { isLoading: isDeleteLoading }] =
    useDeleteMenuItemMutation();

  const items = (itemsResp.data as MenuItem[]) ?? [];
  const meta = itemsResp.meta;
  const apiPageIndexBase = (meta.page - 1) * meta.perPage;

  const categoryOptions = useMemo(
    () => [{ id: "All", name: "All" }, ...categoryNames],
    [categoryNames],
  );

  const tableData = useMemo(
    () =>
      items.map((i) => ({
        ...i,
        image: i.signedUrl || "",
        categoryLabel:
          i.category?.name || (i as any).categoryName || "Uncategorized",
      })),
    [items],
  );

  const handleEdit = useCallback(
    (itemId: string) => {
      const found = items.find((i) => i.id === itemId) || null;
      if (!found) return toast.error("Item not found");
      setEditingItem(found);
      setShowEdit(true);
    },
    [items],
  );

  const handleDelete = useCallback(
    async (itemId: string) => {
      if (!menuId) return toast.error("Missing menu id");
      const ok = window.confirm("Delete this item? This cannot be undone.");
      if (!ok) return;
      try {
        await deleteMenuItem({ menuId, itemId }).unwrap();
        toast.success("Item deleted");
        refetch();
      } catch (e: any) {
        toast.error(e?.data?.message || "Failed to delete item");
      }
    },
    [menuId, deleteMenuItem, refetch],
  );

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
          {row.signedUrl ? (
            <img
              src={row.signedUrl}
              alt={row.name}
              className="w-10 h-10 rounded object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded bg-gray-100" />
          )}
          <span className="truncate max-w-[240px]">{value as string}</span>
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
      render: (v: unknown) => (
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
          {v as string}
        </span>
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (_v, row: any) => (
        <div className="flex gap-2">
          <ActionIcon
            icon={<EditIcon size={22} />}
            onClick={() => handleEdit(row.id)}
          />

          <ConfirmDelete
            loading={isDeleteLoading}
            onConfirm={async () => {
              await deleteMenuItem({ menuId, itemId: row.id }).unwrap();
              toast.success("Item deleted");
              refetch();
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
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h1 className="text-xl font-bold">Menu Items</h1>
        <Button onClick={() => setShowCreate(true)}>
          <AddIcon /> Add Item
        </Button>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

      {/* Table / loader / empty */}
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

      {/* Create modal */}
      {showCreate && (
        <ItemModal
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
          mode="create"
          categories={categoryOptions
            .filter((c) => c.id !== "All")
            .map((c) => ({ id: c.id, name: c.name }))}
          selectedCategory={{ id: "", name: "" }}
          onSuccess={() => {
            setShowCreate(false);
            refetch();
          }}
        />
      )}

      {/* Edit modal */}
      {showEdit && editingItem && (
        <ItemModal
          isOpen={showEdit}
          onClose={() => {
            setShowEdit(false);
            setEditingItem(null);
          }}
          mode="edit"
          categories={categoryOptions
            .filter((c) => c.id !== "All")
            .map((c) => ({ id: c.id, name: c.name }))}
          item={{
            id: editingItem.id,
            name: editingItem.name,
            description: editingItem.description,
            price: editingItem.price,
            deliveryPrice: (editingItem as any).deliveryPrice,
            s3Key: editingItem.s3Key,
            categoryId:
              editingItem.categoryId ?? editingItem.category?.id ?? "",
            signedUrl: editingItem.signedUrl,
          }}
          onSuccess={() => {
            setShowEdit(false);
            setEditingItem(null);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default ItemsListing;
