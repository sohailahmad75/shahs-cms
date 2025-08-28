import React, { type JSX, useEffect, useState } from "react";
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
import type { MenuItem, MenuModifier, ModifierOption } from "../menu.types";
import type { TagOption } from "../../components/helper/components.types";
import TagSelector from "../../components/TagSelector";
import FileUploader from "../../components/FileUploader";
import CloseIcon from "../../assets/styledIcons/CloseIcon";

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
      s3Key: Yup.string().nullable(), // ✅ optional string
    }),
  ),
  modificationTypeId: Yup.string().required(
    "Please select a modification type",
  ),
});

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
  } = useGetMenuItemsQuery({
    menuId,
    perPage: 50,
  });

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

  const initialData: MenuModifier = {
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

  const [initialValues, setInitialValues] = useState<MenuModifier>(initialData);

  useEffect(() => {
    if (modifierId && modifierData) {
      setInitialValues({
        name: modifierData.name || "",
        description: modifierData.description || "",
        minSelection: modifierData.minSelection || 0,
        maxSelection: modifierData.maxSelection || 1,
        isRequired: modifierData.isRequired || false,
        isMoreOnce: modifierData.isMoreOnce || false,
        items: modifierData.items?.map((i: any) => i.id) || [],
        options:
          modifierData.options?.map((opt: ModifierOption) => ({
            ...opt,
            price: opt.price ?? 0,
            deliveryPrice: opt.deliveryPrice ?? 0,
          })) || [],
        modificationTypeId: modifierData.modificationTypeId || "",
      });
    } else {
      setInitialValues(initialData);
    }
  }, [modifierId, modifierData]);

  const handleSubmit = async (values: typeof initialValues) => {
    const payload = { ...values };
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
        {({ values, handleChange, setFieldValue, errors, touched }) => (
          <Form className="grid lg:grid-cols-2 gap-6 h-full">
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
                      ? errors.modificationTypeId
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

            <div className="space-y-4">
              {/* Add options here */}

              <div>
                <div className="flex justify-between items-center pb-2">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Modifier Options
                  </h4>
                  <Button
                    type="button"
                    onClick={() =>
                      setFieldValue("options", [
                        ...values.options,
                        { name: "", price: 0, deliveryPrice: 0 },
                      ])
                    }
                    className="text-sm px-3 py-1.5"
                    icon={<AddIcon />}
                  >
                    <span className="hidden sm:inline">Add option</span>
                  </Button>
                </div>

                <div className="max-h-[300px] sm:max-h-[400px] lg:max-h-[430px] overflow-y-auto pr-1">
                  <ul className="mt-3 space-y-4">
                    {values.options.map((opt, index) => (
                      <li
                        key={index}
                        className="rounded-lg border border-gray-200 p-3 sm:p-4 bg-white"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          {/* Delete button (top-right on mobile, left column on md+) */}
                          <div className="order-last md:col-span-1 flex md:items-start md:justify-end">
                            <Button
                              type="button"
                              className="md:hidden w-full md:w-9 md:h-9 md:p-0"
                            >
                              <span>Delete</span>
                            </Button>

                            <span
                              onClick={() =>
                                setFieldValue(
                                  "options",
                                  values.options.filter((_, i) => i !== index),
                                )
                              }
                              className="hidden md:inline cursor-pointer text-orange-500 hover:scale-110 transition duration-200 ease-in-out "
                            >
                              <CloseIcon size={20} />
                            </span>
                          </div>

                          {/* Image (1/3 on md+) */}
                          <div className="md:col-span-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Option Image{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <FileUploader
                              value={opt.s3Key}
                              onChange={(s3Key) =>
                                setFieldValue(`options[${index}].s3Key`, s3Key)
                              }
                              size={2}
                              fit={"contain"}
                              // menu-modifier-options
                              path="menu-modifier-options"
                              type="image"
                              error={
                                (touched.options as any)?.[index]?.s3Key &&
                                (errors.options as any)?.[index]?.s3Key
                                  ? (errors.options as any)[index].s3Key
                                  : ""
                              }
                              initialPreview={opt?.signedUrl || ""}
                            />
                          </div>

                          {/* Fields (2/3 on md+) */}
                          <div className="md:col-span-7 space-y-4">
                            {/* Field 1 full width */}
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">
                                Option Name{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <InputField
                                name={`options[${index}].name`}
                                value={opt.name}
                                onChange={(e) =>
                                  setFieldValue(
                                    `options[${index}].name`,
                                    e.target.value,
                                  )
                                }
                                placeholder="Option name"
                                error={
                                  (touched.options as any)?.[index]?.name &&
                                  (errors.options as any)?.[index]?.name
                                    ? (errors.options as any)[index].name
                                    : ""
                                }
                              />
                            </div>

                            {/* Field 2 + Field 3 half-half */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                  Price <span className="text-red-500">*</span>
                                </label>
                                <InputField
                                  type="number"
                                  name={`options[${index}].price`}
                                  value={String(opt.price)}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `options[${index}].price`,
                                      e.target.value === ""
                                        ? 0
                                        : Number(e.target.value),
                                    )
                                  }
                                  placeholder="0.00"
                                  inputMode="decimal"
                                  step="0.01"
                                  error={
                                    (touched.options as any)?.[index]?.price &&
                                    (errors.options as any)?.[index]?.price
                                      ? (errors.options as any)[index].price
                                      : ""
                                  }
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                  Delivery Price{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <InputField
                                  type="number"
                                  name={`options[${index}].deliveryPrice`}
                                  value={String(opt.deliveryPrice ?? 0)}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `options[${index}].deliveryPrice`,
                                      e.target.value === ""
                                        ? 0
                                        : Number(e.target.value),
                                    )
                                  }
                                  placeholder="0.00"
                                  inputMode="decimal"
                                  step="0.01"
                                  error={
                                    (touched.options as any)?.[index]
                                      ?.deliveryPrice &&
                                    (errors.options as any)?.[index]
                                      ?.deliveryPrice
                                      ? (errors.options as any)[index]
                                          .deliveryPrice
                                      : ""
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={creating || updating}
            >
              {modifierId ? "Update Modifier" : "Create Modifier"}
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddModifierModal;
