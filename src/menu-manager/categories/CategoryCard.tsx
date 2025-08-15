import React, { useState, useCallback } from "react";
import MenuItemCard from "./MenuItemCard";
import Button from "../../components/Button";
import ArrowIcon from "../../assets/styledIcons/ArrowIcon";
import ItemModal from "../items/ItemModal"; // ← reusable create/edit modal
import AddIcon from "../../assets/styledIcons/AddIcon";
import type { MenuCategory, MenuItem } from "../menu.types";
import { useTheme } from "../../context/themeContext";
import ConfirmDelete from "../../components/ConfirmDelete";
import ActionIcon from "../../components/ActionIcon";
import TrashIcon from "../../assets/styledIcons/TrashIcon";
import {
  useDeleteCategoryMutation,
  useDeleteMenuItemMutation,
} from "../../services/menuApi";
import { toast } from "react-toastify";

interface CategoryProps {
  category: MenuCategory;
  isExpanded: boolean;
  setExpanded: (expanded: boolean) => void;
  menuCategories: { id: string; name: string }[];
  refetchData: () => void;
}

const CategoryCard: React.FC<CategoryProps> = ({
  category,
  isExpanded,
  setExpanded,
  menuCategories,
  refetchData,
}) => {
  const [deleteCategory, { isLoading: isDeletingCategory }] =
    useDeleteCategoryMutation();
  const [deleteMenuItem] = useDeleteMenuItemMutation();

  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const { isDarkMode } = useTheme();

  // EDIT item
  const handleEdit = useCallback(
    (id: string) => {
      const found = category.items?.find((i) => i.id === id) || null;
      if (!found) {
        toast.error("Item not found");
        return;
      }
      setEditingItem(found);
      setShowEditItem(true);
    },
    [category.items],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteMenuItem({ menuId: category.menuId, itemId: id }).unwrap();
      toast.success("Item deleted");
      refetchData();
    },
    [category.menuId, deleteMenuItem],
  );

  return (
    <div
      className={`${isDarkMode ? "bg-slate-950" : "bg-white"} rounded-lg shadow-sm p-5 mb-6 ${
        isDarkMode
          ? "bg-slate-950 border border-slate-800"
          : "border border-gray-100"
      } `}
    >
      <div
        className={`flex justify-between items-center ${isExpanded ? "mb-2 pb-2" : ""}`}
      >
        <div className="flex items-center gap-3">
          {category.signedUrl ? (
            <div className="w-20 h-20 flex items-center justify-center rounded border border-gray-200 bg-white overflow-hidden p-1">
              <img
                src={category.signedUrl}
                alt={category.name}
                className="w-full h-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-500 border border-gray-200 text-center">
              No Image
            </div>
          )}

          <h3 className="text-lg font-semibold">{category.name}</h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {category?.items?.length} Items
          </span>
          <Button
            variant="outlined"
            className="!p-1 !border-none"
            onClick={() => setExpanded(!isExpanded)}
          >
            <ArrowIcon
              size={16}
              className={isExpanded ? "rotate-180" : "rotate-0"}
            />
          </Button>

          {/* Delete category */}
          <ConfirmDelete
            loading={isDeletingCategory}
            onConfirm={async () => {
              await deleteCategory({
                menuId: category.menuId,
                categoryId: category.id,
              }).unwrap();
              toast.success("Menu category deleted successfully");
            }}
            renderTrigger={({ open }) => (
              <ActionIcon
                className="text-red-500"
                icon={<TrashIcon size={22} />}
                onClick={open}
              />
            )}
          />
        </div>
      </div>

      {isExpanded && (
        <>
          <hr
            className={`mb-5 ${
              isDarkMode
                ? "bg-slate-950 border border-slate-800"
                : "border border-gray-200"
            }`}
          />

          <div className="mb-4">
            {category?.items?.length ? (
              <div className="grid md:grid-cols-2 gap-4">
                {category.items.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div
                className={`text-sm text-gray-500 italic px-2 py-4 text-center border border-dashed ${
                  isDarkMode
                    ? "bg-slate-950 border border-slate-800"
                    : "border border-gray-200"
                } rounded`}
              >
                No items in this category yet.
              </div>
            )}
          </div>

          <div className="flex gap-2 text-blue-600 text-sm font-medium flex-wrap">
            <Button
              onClick={() => setShowAddItem(true)}
              variant="outlined"
              className="w-full sm:w-auto"
            >
              <AddIcon size={18} /> Create new item
            </Button>
          </div>

          {/* Create item modal */}
          {showAddItem && (
            <ItemModal
              isOpen={showAddItem}
              onClose={() => setShowAddItem(false)}
              mode="create"
              categories={menuCategories}
              selectedCategory={category}
              onSuccess={() => setShowAddItem(false)}
            />
          )}

          {showEditItem && editingItem && (
            <ItemModal
              isOpen={showEditItem}
              onClose={() => {
                setShowEditItem(false);
                setEditingItem(null);
              }}
              mode="edit"
              categories={menuCategories}
              item={{
                id: editingItem.id,
                name: editingItem.name,
                description: editingItem.description,
                price: editingItem.price,
                deliveryPrice: editingItem.deliveryPrice,
                s3Key: editingItem.s3Key,
                categoryId: editingItem.categoryId,
                signedUrl: editingItem.signedUrl,
              }}
              onSuccess={() => {
                setShowEditItem(false);
                setEditingItem(null);
                refetchData();
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CategoryCard;
