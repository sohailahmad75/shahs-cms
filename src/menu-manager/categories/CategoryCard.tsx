import React, { useState, useCallback, useEffect, useMemo } from "react";
import MenuItemCard from "./MenuItemCard";
import Button from "../../components/Button";
import ArrowIcon from "../../assets/styledIcons/ArrowIcon";
import ItemModal from "../items/ItemModal";
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

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragHandleIcon from "../../assets/styledIcons/DragHandleIcon";

/** DnD activator props passed from parent for the CATEGORY handle */
type HandleBindings = Pick<
  ReturnType<typeof useSortable>,
  "attributes" | "listeners" | "setActivatorNodeRef"
>;

interface CategoryProps {
  category: MenuCategory;
  isExpanded: boolean;
  setExpanded: (expanded: boolean) => void;
  menuCategories: { id: string; name: string }[];
  refetchData: () => void;

  /** Real drag activator for category handle (provided by parent) */
  dragHandle?: HandleBindings;

  /** Notify parent when items order changes */
  onItemsOrderChange?: (
    categoryId: string,
    items: Array<{ id: string; order: number }>,
  ) => void;
}

const byOrder = <T extends { order?: number }>(a: T, b: T) =>
  (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER);

// Sortable wrapper with a floating drag handle for ITEMS
const SortableMenuItemCard: React.FC<{
  item: MenuItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ item, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <button
        ref={setActivatorNodeRef}
        {...listeners}
        {...attributes}
        aria-label="Drag item"
        className="absolute left-2 top-2 z-10 p-1 rounded-md bg-white/80 hover:bg-white shadow cursor-grab active:cursor-grabbing"
        style={{ touchAction: "none" }}
      >
        <DragHandleIcon size={16} />
      </button>

      <MenuItemCard item={item} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
};

const CategoryCard: React.FC<CategoryProps> = ({
  category,
  isExpanded,
  setExpanded,
  menuCategories,
  refetchData,
  dragHandle,
  onItemsOrderChange,
}) => {
  const [deleteCategory, { isLoading: isDeletingCategory }] =
    useDeleteCategoryMutation();
  const [deleteMenuItem] = useDeleteMenuItemMutation();

  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const { isDarkMode } = useTheme();

  // Local items state for DnD — sorted by 'order'
  const [items, setItems] = useState<MenuItem[]>(
    [...(category.items ?? [])].sort(byOrder),
  );
  useEffect(() => {
    setItems([...(category.items ?? [])].sort(byOrder));
  }, [category.items]);

  const handleEdit = useCallback(
    (id: string) => {
      const found = items.find((i) => i.id === id) || null;
      if (!found) return toast.error("Item not found");
      setEditingItem(found);
      setShowEditItem(true);
    },
    [items],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteMenuItem({ menuId: category.menuId, itemId: id }).unwrap();
      toast.success("Item deleted");
      refetchData();
    },
    [category.menuId, deleteMenuItem, refetchData],
  );

  // dnd sensors for items
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      // Move in UI
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const moved = arrayMove(items, oldIndex, newIndex);

      // Re-number 'order' 0..n-1 and update state
      const reOrdered = moved.map((it, idx) => ({ ...it, order: idx }));
      setItems(reOrdered);

      // Notify parent (enable Save button + build nested payload)
      onItemsOrderChange?.(
        category.id,
        reOrdered.map(({ id, order }) => ({ id, order: order ?? 0 })),
      );
    },
    [items, category.id, onItemsOrderChange],
  );

  const itemIds = useMemo(() => items.map((i) => i.id), [items]);

  return (
    <div
      className={`${
        isDarkMode ? "bg-slate-950" : "bg-r"
      } rounded-lg shadow-sm p-5 mb-6 ${
        isDarkMode
          ? "bg-slate-950 border border-slate-800"
          : "border border-gray-100"
      } `}
    >
      <div className={`flex items-center ${isExpanded ? "mb-2 pb-2" : ""}`}>
        {/* LEFT: show the REAL drag handle ONLY when collapsed */}
        {!isExpanded && (
          <button
            ref={dragHandle?.setActivatorNodeRef}
            {...(dragHandle?.listeners ?? {})}
            {...(dragHandle?.attributes ?? {})}
            aria-label="Drag category"
            className="p-1 rounded-md hover:bg-gray-100 active:cursor-grabbing cursor-grab"
            style={{ touchAction: "none" }}
          >
            <DragHandleIcon size={18} />
          </button>
        )}

        {/* MIDDLE: image + title */}
        <div className="flex justify-between items-center w-full ml-3">
          <div className="flex items-center gap-3">
            {category.signedUrl ? (
              <div className="w-20 h-20 flex items-center justify-center rounded border border-gray-200 bg-white overflow-hidden p-1">
                <img
                  src={category.signedUrl}
                  alt={category.name}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-500 border border-gray-200 text-center">
                No Image
              </div>
            )}
            <h3 className="text-lg font-semibold">{category.name}</h3>
          </div>

          {/* RIGHT: count, toggle, delete */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{items?.length} Items</span>
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
            {items?.length ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={itemIds} strategy={rectSortingStrategy}>
                  <div className="grid md:grid-cols-2 gap-4">
                    {items.map((item) => (
                      <SortableMenuItemCard
                        key={item.id}
                        item={item}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
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

          {showAddItem && (
            <ItemModal
              isOpen={showAddItem}
              onClose={() => setShowAddItem(false)}
              mode="create"
              categories={menuCategories}
              selectedCategory={category}
              onSuccess={() => {
                setShowAddItem(false);
                refetchData();
              }}
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
