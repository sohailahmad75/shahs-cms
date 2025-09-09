import React, { useState, useMemo, useCallback } from "react";
import CategoryCard from "./CategoryCard";
import Button from "../../components/Button";
import CollapseIcon from "../../assets/styledIcons/CollapseIcon";
import ExpandIcon from "../../assets/styledIcons/ExpandIcon";
import AddIcon from "../../assets/styledIcons/AddIcon";
import { useGetMenuCategoriesQuery } from "../../services/menuApi";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import { useTheme } from "../../context/themeContext";
import AddCategoryModal from "./AddCategoryModal";
import type { MenuCategory } from "../menu.types";

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
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "react-toastify";

import { useUpdateMenuOrderingMutation } from "../../services/menuApi";

const byOrder = <T extends { order?: number }>(a: T, b: T) =>
  (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER);

const SortableCategoryShell: React.FC<{
  cat: MenuCategory;
  isExpanded: boolean;
  setExpanded: (v: boolean) => void;
  allCats: { id: string; name: string }[];
  refetch: () => void;
  onItemsOrderChange: (
    categoryId: string,
    items: Array<{ id: string; order: number }>,
  ) => void;
}> = ({
  cat,
  isExpanded,
  setExpanded,
  allCats,
  refetch,
  onItemsOrderChange,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cat.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <CategoryCard
        refetchData={refetch}
        key={cat.id}
        category={cat}
        isExpanded={isExpanded}
        setExpanded={setExpanded}
        menuCategories={allCats}
        dragHandle={{ attributes, listeners, setActivatorNodeRef }}
        onItemsOrderChange={onItemsOrderChange}
      />
    </div>
  );
};

const CategoryList: React.FC = () => {
  const { id: menuId = "" } = useParams();
  const {
    data: categoriesData = [],
    isLoading,
    refetch,
  } = useGetMenuCategoriesQuery(menuId);

  const { isDarkMode } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Local sorted categories
  const [cats, setCats] = useState<MenuCategory[]>([]);
  React.useEffect(() => {
    setCats([...(categoriesData ?? [])].sort(byOrder));
  }, [categoriesData]);

  // Expanded state per category name
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const toggleAll = (expand: boolean) => {
    const next: Record<string, boolean> = {};
    cats.forEach((c) => (next[c.name] = expand));
    setExpandedCategories(next);
  };

  // ---- Track "dirty" ordering & payload drafts ----
  const [categoryDraftOrders, setCategoryDraftOrders] = useState<
    Array<{ id: string; order: number }>
  >([]);
  const [itemsDraftByCategory, setItemsDraftByCategory] = useState<
    Record<string, Array<{ id: string; order: number }>>
  >({});
  const dirty =
    categoryDraftOrders.length > 0 ||
    Object.keys(itemsDraftByCategory).length > 0;

  // dnd sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  // When a category is moved
  const handleCategoryDragEnd = useCallback(
    async (e: DragEndEvent) => {
      const { active, over } = e;
      if (!over || active.id === over.id) return;

      const oldIndex = cats.findIndex((c) => c.id === active.id);
      const newIndex = cats.findIndex((c) => c.id === over.id);
      const moved = arrayMove(cats, oldIndex, newIndex);
      const reOrdered = moved.map((c, idx) => ({ ...c, order: idx }));

      setCats(reOrdered);

      // Build draft orders for categories
      setCategoryDraftOrders(
        reOrdered.map(({ id, order }) => ({ id, order: order ?? 0 })),
      );
    },
    [cats],
  );

  // When items order changes inside a category
  const handleItemsOrderChange = useCallback(
    (categoryId: string, items: Array<{ id: string; order: number }>) => {
      setItemsDraftByCategory((prev) => ({ ...prev, [categoryId]: items }));
    },
    [],
  );

  // Persist both categories + items (nested)
  const [updateMenuOrdering, { isLoading: saving }] =
    useUpdateMenuOrderingMutation();

  const handleSaveOrdering = useCallback(async () => {
    if (!dirty) return;

    const catOrderMap = new Map(
      categoryDraftOrders.map((c) => [c.id, c.order]),
    );

    const categoriesPayload = cats.map((c, idx) => {
      const orderForCat = catOrderMap.has(c.id)
        ? (catOrderMap.get(c.id) as number)
        : idx;

      // items: prefer draft if present, otherwise from current cat.items sorted by order/index
      const itemsForCat =
        itemsDraftByCategory[c.id] ??
        (c.items ?? [])
          .slice()
          .sort(byOrder)
          .map((it, i) => ({ id: it.id, order: it.order ?? i }));

      return {
        id: c.id,
        order: orderForCat,
        items: itemsForCat,
      };
    });
    await updateMenuOrdering({
      menuId,
      categories: categoriesPayload,
    }).unwrap();

    toast.success("Ordering saved");
    // clear drafts
    setCategoryDraftOrders([]);
    setItemsDraftByCategory({});
    // sync latest
    refetch();
  }, [
    dirty,
    categoryDraftOrders,
    itemsDraftByCategory,
    cats,
    updateMenuOrdering,
    menuId,
    refetch,
  ]);

  const categoryIds = useMemo(() => cats.map((c) => c.id), [cats]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outlined" onClick={() => toggleAll(false)}>
                <CollapseIcon />{" "}
                <span className="hidden sm:inline">Collapse all</span>
              </Button>
              <Button variant="outlined" onClick={() => toggleAll(true)}>
                <ExpandIcon />{" "}
                <span className="hidden sm:inline">Expand all</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {/* Save Order button only enabled when anything changed */}
              <Button
                onClick={handleSaveOrdering}
                disabled={!dirty || saving}
                loading={saving}
              >
                Save Order
              </Button>

              <Button onClick={() => setIsModalOpen(true)} icon={<AddIcon />}>
                <span className="hidden sm:inline">Add Category</span>
              </Button>
            </div>
          </div>

          <div
            className={`space-y-6 mt-10 ${
              isDarkMode ? "bg-slate-900" : "bg-white"
            } p-6 rounded shadow-sm`}
          >
            {cats.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">
                No categories found
              </p>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleCategoryDragEnd}
              >
                <SortableContext
                  items={categoryIds}
                  strategy={verticalListSortingStrategy}
                >
                  {cats.map((cat) => (
                    <SortableCategoryShell
                      key={cat.id}
                      cat={cat}
                      isExpanded={expandedCategories[cat.name] ?? true}
                      setExpanded={(val) =>
                        setExpandedCategories((prev) => ({
                          ...prev,
                          [cat.name]: val,
                        }))
                      }
                      allCats={cats.map((c) => ({ id: c.id, name: c.name }))}
                      refetch={refetch}
                      onItemsOrderChange={handleItemsOrderChange}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </>
      )}

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        menuId={menuId}
      />
    </>
  );
};

export default CategoryList;
