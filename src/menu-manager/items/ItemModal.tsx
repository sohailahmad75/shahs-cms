import React, { useMemo, useState, useEffect } from "react";
import Modal from "../../components/Modal";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import Button from "../../components/Button";
import {
  useCreateItemMutation,
  useUpdateMenuItemMutation,
} from "../../services/menuApi";
import { useGetMenuItemQuery } from "../../services/menuApi"; // <-- make sure this query exists
import { toast } from "react-toastify";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FileUploader from "../../components/FileUploader";
import { useParams } from "react-router-dom";
import type { MenuCategory, MenuItem } from "../menu.types";

/* dnd-kit (same stack + icon as your CategoryCard) */
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

type Mode = "create" | "edit";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode: Mode;
  categories: { id: string; name: string }[];
  selectedCategory?: MenuCategory;
  itemId?: string; // <-- only id in edit mode
  onSuccess?: () => void;
};

const itemSchema = Yup.object().shape({
  name: Yup.string().required("Item name is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .required("Price is required"),
  deliveryPrice: Yup.number()
    .typeError("Delivery Price must be a number")
    .required("Delivery Price is required"),
  categoryId: Yup.string().required("Category is required"),
  s3Key: Yup.string().when([], {
    is: () => false,
    then: (s) => s,
    otherwise: (s) => s,
  }),
});

/* ---------- Sortable row for a modifier (Right panel) ---------- */
const SortableModifierRow: React.FC<{
  id: string;
  name: string;
}> = ({ id, name }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between border rounded p-2 bg-white"
    >
      <div className="flex items-center gap-2">
        <button
          ref={setActivatorNodeRef}
          {...listeners}
          {...attributes}
          aria-label="Drag modifier"
          className="p-1 rounded-md bg-white/80 hover:bg-white shadow cursor-grab active:cursor-grabbing"
          style={{ touchAction: "none" }}
        >
          <DragHandleIcon size={16} />
        </button>
        <span className="text-sm">{name}</span>
      </div>
    </div>
  );
};

const ItemModal: React.FC<Props> = ({
  isOpen,
  onClose,
  mode,
  categories,
  selectedCategory,
  itemId,
  onSuccess,
}) => {
  const { id: menuId = "" } = useParams();
  const [createItem, { isLoading: creating }] = useCreateItemMutation();
  const [updateItem, { isLoading: updating }] = useUpdateMenuItemMutation();

  // fetch rich item (modifiers with pivot)
  const { data: itemData, isFetching: fetchingItem } = useGetMenuItemQuery(
    { menuId, itemId: itemId! },
    { skip: mode !== "edit" || !itemId },
  );

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  /* ---------- RIGHT PANEL STATE ---------- */
  type Row = { id: string; name: string; order: number };
  const [rows, setRows] = useState<Row[]>([]);

  // hydrate rows from API (respect pivot order)
  useEffect(() => {
    if (mode === "edit" && itemData?.modifiers) {
      const hydrated: Row[] = (itemData.modifiers as any[])
        .map((m: any, i: number) => ({
          id: m.id,
          name: m.name,
          order: m.pivotOrder ?? m.menuItemModifier?.order ?? i,
        }))
        .sort((a, b) => a.order - b.order)
        .map((r, i) => ({ ...r, order: i })); // normalize 0..n-1
      setRows(hydrated);
    } else {
      setRows([]);
    }
  }, [mode, itemData?.modifiers]);

  const modifierIds = useMemo(() => rows.map((r) => r.id), [rows]);

  // same sensors as your CategoryCard
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = rows.findIndex((r) => r.id === active.id);
    const newIndex = rows.findIndex((r) => r.id === over.id);
    const moved = arrayMove(rows, oldIndex, newIndex).map((r, i) => ({
      ...r,
      order: i,
    }));
    setRows(moved);
  };

  /* ---------- LEFT PANEL (form) ---------- */
  const initialValues: MenuItem = useMemo(
    () => ({
      name: itemData?.name ?? "",
      description: itemData?.description ?? "",
      price: itemData?.price ?? "",
      deliveryPrice: itemData?.deliveryPrice ?? "",
      s3Key: itemData?.s3Key ?? "",
      categoryId:
        itemData?.categoryId ??
        itemData?.category?.id ??
        selectedCategory?.id ??
        "",
    }),
    [itemData, selectedCategory],
  );

  const requireImage = useMemo(() => {
    const hasServerImage =
      !!itemData?.s3Key || !!itemData?.signedUrl || !!itemData?.imageUrl;
    return mode === "create" || !hasServerImage;
  }, [mode, itemData]);

  const handleSubmit = async (values: typeof initialValues) => {
    if (mode === "create") {
      await createItem({
        categoryId: values.categoryId,
        payload: {
          ...values,
          categoryId: undefined,
          price: parseFloat(String(values.price)),
          deliveryPrice: parseFloat(String(values.deliveryPrice)),
        },
      }).unwrap();
      toast.success("Item created");
    } else {
      if (!menuId) throw new Error("Missing menu id");
      if (!itemId) throw new Error("Missing item id");

      const payload: any = {
        name: values.name?.trim(),
        description: values.description,
        price: parseFloat(String(values.price)),
        deliveryPrice: parseFloat(String(values.deliveryPrice)),
        categoryId: values.categoryId,
        ...(values.s3Key ? { s3Key: values.s3Key } : {}),
      };

      // include modifiersOrder from right panel
      if (rows.length) {
        payload.modifiersOrder = rows.map((r) => ({
          modifierId: r.id,
          order: r.order,
        }));
      }

      await updateItem({ menuId, itemId, payload }).unwrap();
      toast.success("Item updated");
    }

    onClose();
    onSuccess?.();
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
      setPreviewImage(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        if (previewImage) {
          URL.revokeObjectURL(previewImage);
          setPreviewImage(null);
        }
      }}
      title={mode === "create" ? "Add New Item" : "Edit Item"}
      width="max-w-5xl"
    >
      {mode === "edit" && fetchingItem ? (
        <div className="py-10 text-center text-gray-500">Loading item…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT: form (2/3) */}
          <div className="md:col-span-2">
            <Formik
              initialValues={initialValues}
              validationSchema={itemSchema}
              enableReinitialize
              validateOnChange={false}
              validateOnBlur={false}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange, errors, touched, setFieldValue }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Item name <span className="text-red-500">*</span>
                    </label>
                    <InputField
                      name="name"
                      placeholder="Item name"
                      value={values.name}
                      onChange={handleChange}
                      error={touched.name ? errors.name : ""}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Description
                    </label>
                    <InputField
                      name="description"
                      placeholder="Description"
                      value={values.description}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Price <span className="text-red-500">*</span>
                      </label>
                      <InputField
                        name="price"
                        type="number"
                        placeholder="Price"
                        value={values.price}
                        onChange={handleChange}
                        error={touched.price ? errors.price : ""}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Delivery Price <span className="text-red-500">*</span>
                      </label>
                      <InputField
                        name="deliveryPrice"
                        type="number"
                        placeholder="Delivery Price"
                        value={values.deliveryPrice}
                        onChange={handleChange}
                        error={
                          touched.deliveryPrice ? errors.deliveryPrice : ""
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <SelectField
                      name="categoryId"
                      value={values.categoryId}
                      onChange={handleChange}
                      options={categories.map((c) => ({
                        label: c.name,
                        value: c.id,
                      }))}
                      placeholder="Select category"
                      error={touched.categoryId ? errors.categoryId : ""}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Item Image{" "}
                      {requireImage && <span className="text-red-500">*</span>}
                    </label>
                    <FileUploader
                      value={values.s3Key}
                      onChange={(key) => setFieldValue("s3Key", key)}
                      path="menu-items"
                      type="image"
                      error={
                        requireImage &&
                        touched.s3Key &&
                        (errors.s3Key as string)
                      }
                      initialPreview={
                        previewImage ??
                        itemData?.signedUrl ??
                        itemData?.imageUrl ??
                        ""
                      }
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    loading={creating || updating}
                  >
                    {mode === "create" ? "Create Item" : "Save Changes"}
                  </Button>
                </Form>
              )}
            </Formik>
          </div>

          {/* RIGHT: modifiers (1/3) with same DnD/handle icon style */}
          <div className="md:col-span-1">
            <div className="text-sm font-semibold mb-2">Modifiers</div>

            {mode === "edit" ? (
              rows.length ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={onDragEnd}
                >
                  <SortableContext
                    items={modifierIds}
                    strategy={rectSortingStrategy}
                  >
                    <div className="space-y-2">
                      {rows.map((r) => (
                        <SortableModifierRow
                          key={r.id}
                          id={r.id}
                          name={r.name}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="text-xs text-gray-500 border border-dashed rounded p-3">
                  No modifiers attached to this item.
                </div>
              )
            ) : (
              <div className="text-xs text-gray-500 border border-dashed rounded p-3">
                Modifiers appear here after item is created.
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ItemModal;
