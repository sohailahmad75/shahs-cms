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

const ModifierSchema = Yup.object().shape({
  name: Yup.string().required("Modifier name is required"),
  description: Yup.string(),
  minSelection: Yup.number().required().min(0),
  maxSelection: Yup.number().required().min(0),
  isRequired: Yup.boolean().required(),
  isMoreOnce: Yup.boolean().required(),
  items: Yup.array().min(1, "Select at least one item"),
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

  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
    minSelection: 0,
    maxSelection: 1,
    isRequired: false,
    isMoreOnce: false,
    items: [],
  });

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
      });
    }
  }, [modifierId, modifierData]);

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      if (modifierId) {
        await updateModifier({
          id: modifierId,
          payload: { ...values },
        }).unwrap();
        toast.success("Modifier updated");
      } else {
        await createModifier({ menuId, payload: { ...values } }).unwrap();
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
              <InputField
                name="name"
                placeholder="Modifier name"
                value={values.name}
                onChange={handleChange}
                error={touched.name ? errors.name : ""}
              />
              <InputField
                name="description"
                placeholder="Description"
                value={values.description}
                onChange={handleChange}
              />
              <InputField
                name="minSelection"
                type="number"
                placeholder="Min selection"
                value={String(values.minSelection)}
                onChange={handleChange}
              />
              <InputField
                name="maxSelection"
                type="number"
                placeholder="Max selection"
                value={String(values.maxSelection)}
                onChange={handleChange}
              />

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
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Select items to apply to
                </label>
                <MultiSelect
                  name="items"
                  value={values.items}
                  onChange={(val) => setFieldValue("items", val)}
                  options={allItems.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  placeholder="Select items"
                  error={touched.items ? (errors.items as string) : ""}
                />
              </div>

              {/* Add options here */}
              <div>
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Modifier Options
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      // add option handler
                    }}
                    className="text-sm text-primary-100 hover:underline"
                  >
                    + Add option
                  </button>
                </div>

                <ul className="mt-2 space-y-2">
                  {/* List current options with delete buttons */}
                  {modifierData?.options?.map((opt: any) => (
                    <li
                      key={opt.id}
                      className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border"
                    >
                      <span>{opt.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          // delete option handler
                        }}
                        className="text-sm text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
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
