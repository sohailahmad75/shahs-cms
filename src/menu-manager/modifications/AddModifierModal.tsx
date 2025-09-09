import React, {
  type JSX,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Modal from "../../components/Modal";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import {
  useCreateModifierMutation,
  useUpdateModifierMutation,
  useGetModifierByIdQuery,
  useGetAllModificationTypesQuery,
  useGetMenuItemsQuery,
} from "../../services/menuApi";
import MultiSelect from "../../components/MultiSelect";
import CheckboxField from "../../components/CheckboxField";
import AddIcon from "../../assets/styledIcons/AddIcon";
import ArrowIcon from "../../assets/styledIcons/ArrowIcon";
import DragHandleIcon from "../../assets/styledIcons/DragHandleIcon";
import CloseIcon from "../../assets/styledIcons/CloseIcon";
import FileUploader from "../../components/FileUploader";
import TagSelector from "../../components/TagSelector";

import type { MenuItem, MenuModifier, ModifierOption } from "../menu.types";
import type { TagOption } from "../../components/helper/components.types";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CollapseIcon from "../../assets/styledIcons/CollapseIcon";
import ExpandIcon from "../../assets/styledIcons/ExpandIcon";

/* ---------------------------------- Schema --------------------------------- */

const ModifierSchema = Yup.object().shape({
  name: Yup.string().required("Modifier name is required"),
  description: Yup.string(),
  minSelection: Yup.number().required().min(0),
  maxSelection: Yup.number().required().min(0),
  isRequired: Yup.boolean().required(),
  isMoreOnce: Yup.boolean().required(),
  items: Yup.array().min(1, "Select at least one item"),
  options: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Option name is required"),
      price: Yup.number().min(0, "Price must be 0 or more").required(),
      deliveryPrice: Yup.number()
        .min(0, "Delivery Price must be 0 or more")
        .required(),
      s3Key: Yup.string().nullable(),
      order: Yup.number().min(0).required(),
    }),
  ),
  modificationTypeId: Yup.string().required(
    "Please select a modification type",
  ),
});

/* ----------------------------- Helper / Typings ----------------------------- */

type OptionForm = ModifierOption & {
  // local stable id for DnD (use real id if present, else a client id)
  cid: string;
  order: number;
  signedUrl?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  menuId: string;
  modifierId?: string; // optional for edit
};

const iconMap: Record<string, JSX.Element> = {
  add: <AddIcon />,
  remove: <AddIcon />,
  cook: <AddIcon />,
  size: <AddIcon />,
  variation: <AddIcon />,
  gift: <AddIcon />,
};

const makeCid = () => "cid_" + Math.random().toString(36).slice(2, 10);

/* --------------------------- Sortable Option Row ---------------------------- */

const SortableOptionRow: React.FC<{
  opt: OptionForm;
  index: number;
  collapsed: boolean;
  onToggleCollapse: (cid: string) => void;
  onRemove: (index: number) => void;
  setFieldValue: (field: string, value: any) => void;
  touched: any;
  errors: any;
}> = React.memo(
  ({
    opt,
    index,
    collapsed,
    onToggleCollapse,
    onRemove,
    setFieldValue,
    touched,
    errors,
    allowDrag,
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      setActivatorNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: opt.cid,
    });

    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.9 : 1,
    };

    const nameError =
      touched?.options?.[index]?.name && errors?.options?.[index]?.name
        ? errors.options[index].name
        : "";
    const priceError =
      touched?.options?.[index]?.price && errors?.options?.[index]?.price
        ? errors.options[index].price
        : "";
    const deliveryError =
      touched?.options?.[index]?.deliveryPrice &&
      errors?.options?.[index]?.deliveryPrice
        ? errors.options[index].deliveryPrice
        : "";
    const s3KeyError =
      touched?.options?.[index]?.s3Key && errors?.options?.[index]?.s3Key
        ? errors.options[index].s3Key
        : "";

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="rounded-lg border border-gray-200 bg-white"
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2">
          {/* Drag handle only when collapsed */}
          {collapsed && (
            <button
              type="button"
              ref={setActivatorNodeRef}
              {...listeners}
              {...attributes}
              aria-label="Drag option"
              className="p-1 rounded-md hover:bg-gray-100 active:cursor-grabbing cursor-grab"
              style={{ touchAction: "none" }}
            >
              <DragHandleIcon size={18} />
            </button>
          )}
          {/* Collapse toggle */}
          <button
            type="button"
            onClick={() => onToggleCollapse(opt.cid)}
            className="p-1 rounded-md hover:bg-gray-100 cursor-pointer"
            aria-label={collapsed ? "Expand option" : "Collapse option"}
          >
            <ArrowIcon
              size={16}
              className={collapsed ? "rotate-0" : "rotate-180"}
            />
          </button>

          {/* Title snapshot */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {opt.name?.trim() ? opt.name : "Untitled option"}
            </p>
            <p className="text-xs text-gray-500">
              + £{Number(opt.price ?? 0).toFixed(2)} In-store • £
              {Number(opt.deliveryPrice ?? 0).toFixed(2)} delivery
            </p>
          </div>

          {/* Remove */}
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-1 rounded-md text-orange-500 hover:bg-orange-50 cursor-pointer"
            aria-label="Remove option"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Body (expanded) */}
        {!collapsed && (
          <div className="px-3 pb-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Image */}
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Option Image
                </label>
                <FileUploader
                  value={opt.s3Key}
                  onChange={(s3Key) =>
                    setFieldValue(`options[${index}].s3Key`, s3Key)
                  }
                  size={2}
                  fit="contain"
                  path="menu-modifier-options"
                  type="image"
                  error={s3KeyError || ""}
                  initialPreview={opt?.signedUrl || ""}
                />
              </div>

              {/* Fields */}
              <div className="md:col-span-8 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Option Name
                  </label>
                  <InputField
                    name={`options[${index}].name`}
                    value={opt.name}
                    onChange={(e) =>
                      setFieldValue(`options[${index}].name`, e.target.value)
                    }
                    placeholder="Option name"
                    error={nameError}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Price
                    </label>
                    <InputField
                      type="number"
                      name={`options[${index}].price`}
                      value={String(opt.price ?? 0)}
                      onChange={(e) =>
                        setFieldValue(
                          `options[${index}].price`,
                          e.target.value === "" ? 0 : Number(e.target.value),
                        )
                      }
                      placeholder="0.00"
                      inputMode="decimal"
                      step="0.01"
                      error={priceError}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Delivery Price
                    </label>
                    <InputField
                      type="number"
                      name={`options[${index}].deliveryPrice`}
                      value={String(opt.deliveryPrice ?? 0)}
                      onChange={(e) =>
                        setFieldValue(
                          `options[${index}].deliveryPrice`,
                          e.target.value === "" ? 0 : Number(e.target.value),
                        )
                      }
                      placeholder="0.00"
                      inputMode="decimal"
                      step="0.01"
                      error={deliveryError}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
);
SortableOptionRow.displayName = "SortableOptionRow";

/* ------------------------------ Main Component ----------------------------- */

const AddModifierModal: React.FC<Props> = ({
  isOpen,
  onClose,
  menuId,
  modifierId,
}) => {
  const [createModifier, { isLoading: creating }] = useCreateModifierMutation();
  const [updateModifier, { isLoading: updating }] = useUpdateModifierMutation();
  const { data: allModTypes = [] } = useGetAllModificationTypesQuery();
  const {
    data: itemsResp = {
      data: [],
      meta: { total: 0, page: 1, perPage: 50, totalPages: 1 },
    },
    isLoading: itemsLoading,
  } = useGetMenuItemsQuery({ menuId, perPage: 50 }); // a bit larger page for picking items

  const allItems = itemsResp.data as MenuItem[];
  const { data: modifierData, isLoading: modifierLoading } =
    useGetModifierByIdQuery(modifierId!, {
      skip: !modifierId,
    });

  const MODIFIER_OPTIONS: TagOption[] = allModTypes.map((type) => ({
    label: type.name,
    value: type.id,
    icon: iconMap[type.id] || <AddIcon />,
  }));

  const baseValues: MenuModifier & { options: OptionForm[] } = {
    name: "",
    description: "",
    minSelection: 0,
    maxSelection: 1,
    isRequired: false,
    isMoreOnce: false,
    items: [],
    options: [],
    modificationTypeId: "",
  };

  const [initialValues, setInitialValues] = useState(baseValues);

  // collapsed state by cid
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const setCollapsedForAll = (opts: OptionForm[], to: boolean) =>
    setCollapsed(Object.fromEntries(opts.map((o) => [o.cid, to])));

  // Remember initial order to toggle Save Ordering button
  const initialOrderRef = useRef<string>("");

  useEffect(() => {
    if (modifierId && modifierData) {
      const opts: OptionForm[] = (modifierData.options || []).map(
        (opt: any, idx: number) => ({
          cid: opt.id ?? makeCid(),
          id: opt.id,
          name: opt.name ?? "",
          price: opt.price ?? 0,
          deliveryPrice: opt.deliveryPrice ?? 0,
          s3Key: opt.s3Key ?? "",
          signedUrl: opt.signedUrl,
          order: Number.isFinite(opt.order) ? opt.order : idx,
        }),
      );
      // sort by order just in case
      opts.sort((a, b) => a.order - b.order);

      setInitialValues({
        name: modifierData.name || "",
        description: modifierData.description || "",
        minSelection: modifierData.minSelection || 0,
        maxSelection: modifierData.maxSelection || 1,
        isRequired: !!modifierData.isRequired,
        isMoreOnce: !!modifierData.isMoreOnce,
        items: modifierData.items?.map((i: any) => i.id) || [],
        options: opts,
        modificationTypeId: modifierData.modificationTypeId || "",
      });

      setCollapsedForAll(opts, false);
      initialOrderRef.current = JSON.stringify(opts.map((o) => o.cid));
    } else {
      setInitialValues(baseValues);
      setCollapsed({});
      initialOrderRef.current = JSON.stringify([]);
    }
  }, [modifierId, modifierData]);

  const toggleCollapse = useCallback((cid: string) => {
    setCollapsed((prev) => ({ ...prev, [cid]: !prev[cid] }));
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const handleSubmit = async (values: typeof initialValues) => {
    // Normalize order before sending
    const normalizedOptions = [...values.options]
      .sort((a, b) => a.order - b.order)
      .map((o, idx) => ({
        // keep id if existing; BE recreates on update but it's okay
        id: o.id,
        name: o.name,
        price: o.price,
        deliveryPrice: o.deliveryPrice,
        s3Key: o.s3Key || "",
        order: idx, // ensure 0..n-1
      }));

    const payload = {
      name: values.name,
      description: values.description,
      minSelection: values.minSelection,
      maxSelection: values.maxSelection,
      isRequired: values.isRequired,
      isMoreOnce: values.isMoreOnce,
      items: values.items,
      options: normalizedOptions,
      modificationTypeId: values.modificationTypeId,
    };

    if (modifierId) {
      await updateModifier({ id: modifierId, payload }).unwrap();
      toast.success("Modifier updated");
    } else {
      await createModifier({ menuId, payload }).unwrap();
      toast.success("Modifier created");
    }
    onClose();
  };

  if (itemsLoading || (modifierId && modifierLoading)) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modifierId ? "Edit Modification" : "Create New Modification"}
      width="max-w-screen-xl"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={ModifierSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({
          values,
          handleChange,
          setFieldValue,
          errors,
          touched,
          submitForm,
          dirty,
        }) => {
          const optionIds = useMemo(
            () => values.options.map((o) => o.cid),
            [values.options],
          );
          const orderChanged = useMemo(() => {
            const now = JSON.stringify(optionIds);
            return now !== initialOrderRef.current;
          }, [optionIds]);

          const onDragEnd = (event: DragEndEvent) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;

            const oldIndex = values.options.findIndex(
              (o) => o.cid === active.id,
            );
            const newIndex = values.options.findIndex((o) => o.cid === over.id);
            if (oldIndex < 0 || newIndex < 0) return;

            const moved = arrayMove(values.options, oldIndex, newIndex).map(
              (o, i) => ({
                ...o,
                order: i,
              }),
            );

            setFieldValue("options", moved);
          };

          const addOption = () => {
            const next: OptionForm = {
              cid: makeCid(),
              id: undefined as any,
              name: "",
              price: 0,
              deliveryPrice: 0,
              s3Key: "",
              order: values.options.length,
            };
            const updated = [...values.options, next];
            setFieldValue("options", updated);
            setCollapsed((prev) => ({ ...prev, [next.cid]: false })); // open the new one
          };

          const removeOption = (idx: number) => {
            const removed = [...values.options];
            const [gone] = removed.splice(idx, 1);
            const reindexed = removed.map((o, i) => ({ ...o, order: i }));
            setFieldValue("options", reindexed);
            setCollapsed((prev) => {
              const cp = { ...prev };
              if (gone) delete cp[gone.cid];
              return cp;
            });
          };

          const expandAll = () => setCollapsedForAll(values.options, false);
          const collapseAll = () => setCollapsedForAll(values.options, true);

          return (
            <Form className="grid lg:grid-cols-2 gap-6 h-full">
              {/* Left side */}
              <div className="space-y-4 md:border-r md:border-gray-200 md:pr-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Modifier name <span className="text-red-500">*</span>
                  </label>
                  <InputField
                    name="name"
                    placeholder="Modifier name"
                    value={values.name}
                    onChange={handleChange}
                    error={touched.name ? (errors.name as string) : ""}
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

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Select items to apply to{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <MultiSelect
                    name="items"
                    value={values.items}
                    onChange={(val) => setFieldValue("items", val)}
                    options={allItems?.map((item: MenuItem) => ({
                      label: item.name,
                      value: item.id,
                    }))}
                    placeholder="Select items"
                    error={touched.items ? (errors.items as string) : ""}
                  />
                </div>

                <div className="flex justify-between items-center gap-2 flex-wrap">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Min selection <span className="text-red-500">*</span>
                    </label>
                    <InputField
                      name="minSelection"
                      type="number"
                      placeholder="Min selection"
                      value={String(values.minSelection)}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Max selection <span className="text-red-500">*</span>
                    </label>
                    <InputField
                      name="maxSelection"
                      type="number"
                      placeholder="Max selection"
                      value={String(values.maxSelection)}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Modification type <span className="text-red-500">*</span>
                  </label>
                  <TagSelector
                    value={values.modificationTypeId}
                    onChange={(val) => setFieldValue("modificationTypeId", val)}
                    options={MODIFIER_OPTIONS}
                    error={
                      touched.modificationTypeId && errors.modificationTypeId
                        ? (errors.modificationTypeId as string)
                        : ""
                    }
                  />
                </div>

                <CheckboxField
                  name="isRequired"
                  label="Is Required?"
                  checked={values.isRequired}
                  onChange={handleChange}
                />
                <CheckboxField
                  name="isMoreOnce"
                  label="Can choose more than once?"
                  checked={values.isMoreOnce}
                  onChange={handleChange}
                />
              </div>

              {/* Right side (Options w/ DnD) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Modifier Options
                  </h4>

                  <div className="flex items-center gap-2">
                    <Button variant="outlined" onClick={collapseAll}>
                      <CollapseIcon />
                    </Button>
                    <Button variant="outlined" onClick={expandAll}>
                      <ExpandIcon />
                    </Button>

                    <Button
                      type="button"
                      onClick={addOption}
                      className="px-3 py-1.5"
                      icon={<AddIcon />}
                    >
                      <span className="hidden sm:inline">Add option</span>
                    </Button>
                  </div>
                </div>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={onDragEnd}
                >
                  <SortableContext
                    items={optionIds}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1 overflow-x-hidden">
                      {values.options.length === 0 ? (
                        <div className="text-sm text-gray-500 italic border border-dashed border-gray-200 rounded p-4 text-center">
                          No options added yet.
                        </div>
                      ) : (
                        values.options
                          .slice()
                          .sort((a, b) => a.order - b.order)
                          .map((opt, index) => (
                            <SortableOptionRow
                              key={opt.cid}
                              opt={opt}
                              index={index}
                              collapsed={!!collapsed[opt.cid]}
                              onToggleCollapse={toggleCollapse}
                              onRemove={removeOption}
                              setFieldValue={setFieldValue}
                              touched={touched}
                              errors={errors}
                            />
                          ))
                      )}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>

              {/* Submit (same API) */}
              <div className="lg:col-span-2">
                <Button
                  type="submit"
                  className="w-full"
                  loading={creating || updating}
                  disabled={!dirty && !orderChanged}
                >
                  {modifierId ? "Update Modifier" : "Create Modifier"}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default AddModifierModal;
