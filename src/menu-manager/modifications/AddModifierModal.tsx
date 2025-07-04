import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Modal from "../../components/Modal";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import {
  useCreateModifierMutation,
  useUpdateModifierMutation,
  useGetAllMenuItemsQuery,
  useGetModifierByIdQuery,
} from "../../services/menuApi";
import MultiSelect from "../../components/MultiSelect";
import CheckboxField from "../../components/CheckboxField";
import type { MenuItem, MenuModifier } from "../../types";
import AddIcon from "../../assets/styledIcons/AddIcon";

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
    }),
  ),
});

type Props = {
  isOpen: boolean;
  onClose: () => void;
  menuId: string;
  modifierId?: string; // optional for edit
};

const AddModifierModal: React.FC<Props> = ({
  isOpen,
  onClose,
  menuId,
  modifierId,
}) => {
  const [createModifier, { isLoading: creating }] = useCreateModifierMutation();
  const [updateModifier, { isLoading: updating }] = useUpdateModifierMutation();

  const { data: allItems = [], isLoading: itemsLoading } =
    useGetAllMenuItemsQuery(menuId);
  const { data: modifierData, isLoading: modifierLoading } =
    useGetModifierByIdQuery(modifierId!, {
      skip: !modifierId,
    });

  const initialData: MenuModifier = {
    name: "",
    description: "",
    minSelection: 0,
    maxSelection: 1,
    isRequired: false,
    isMoreOnce: false,
    items: [],
    options: [],
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
          modifierData.options?.map((opt) => ({
            name: opt.name,
            price: opt.price,
          })) || [],
      });
    } else {
      setInitialValues(initialData);
    }
  }, [modifierId, modifierData]);

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const payload = { ...values };
      if (modifierId) {
        await updateModifier({ id: modifierId, payload }).unwrap();
        toast.success("Modifier updated");
      } else {
        await createModifier({ menuId, payload }).unwrap();
        toast.success("Modifier created");
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save modifier");
    }
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
          <Form className="grid md:grid-cols-2 gap-6 h-full">
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

              <div>
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
            </div>

            <div className="space-y-4">
              {/* Add options here */}
              <div>
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Modifier Options
                  </h4>
                  <Button
                    type="button"
                    onClick={() =>
                      setFieldValue("options", [
                        ...values.options,
                        { name: "", price: 0 },
                      ])
                    }
                    className="text-sm px-3 py-1.5"
                    icon={<AddIcon />}
                  >
                    <span className="hidden sm:inline">Add option</span>
                  </Button>
                </div>

                <div className="max-h-[300px] sm:max-h-[400px] lg:max-h-[430px] overflow-y-auto pr-1">
                  <ul className="mt-2 space-y-4">
                    {values.options.map((opt, index) => (
                      <li
                        key={index}
                        className="pb-4 bg-white space-y-3 border-b border-gray-200 last:border-b-0"
                      >
                        <div className="grid md:grid-cols-12 gap-4">
                          <div className="md:col-span-6">
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
                                touched.options?.[index]?.name &&
                                errors.options?.[index]?.name
                                  ? (errors.options[index] as any).name
                                  : ""
                              }
                            />
                          </div>

                          <div className="md:col-span-4">
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
                                  parseFloat(e.target.value),
                                )
                              }
                              placeholder="Price"
                              error={
                                touched.options?.[index]?.price &&
                                errors.options?.[index]?.price
                                  ? (errors.options[index] as any).price
                                  : ""
                              }
                            />
                          </div>

                          <div className="md:col-span-2 flex items-end pt-2">
                            <Button
                              variant="outlined"
                              type="button"
                              onClick={() =>
                                setFieldValue(
                                  "options",
                                  values.options.filter((_, i) => i !== index),
                                )
                              }
                            >
                              Delete
                            </Button>
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
