import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Modal from "../../../components/Modal";
import InputField from "../../../components/InputField";
import SelectField from "../../../components/SelectField";
import DatePickerField from "../../../components/DatePickerField";
import Button from "../../../components/Button";
import FileUploader from "../../../components/FileUploader";
import { useParams } from "react-router-dom";
import MultiSelect from "../../../components/MultiSelect";

// Static stores data
const allStoreOptions = [
  { label: "Store 1", value: "store1" },
  { label: "Store 2", value: "store2" },
  { label: "Store 3", value: "store3" },
  { label: "Store 4", value: "store4" },
  { label: "Store 5", value: "store5" },
];

const fileTypeOptions = [
  { label: "Passport", value: "passport" },
  { label: "FSA Cert", value: "fsa_cert" },
  { label: "License", value: "license" },
];

const emptyInitialValues = {
  name: "",
  userType: "",
  fileS3Key: "",
  fileType: "",
  expiresAt: "",
  remindBeforeDays: 7,
  stores: [] as string[],
};

const UsersTypeModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingUsers,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: typeof emptyInitialValues) => void;
  editingUsers?: any;
  isSubmitting?: boolean;
}) => {
  const { id } = useParams();
  const [availableStores, setAvailableStores] = useState(allStoreOptions);

  // Validation schema with conditions
  const UsersSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    userType: Yup.string().required("Select a user type"),
    fileS3Key: Yup.string().when("userType", {
      is: "staff",
      then: (schema) => schema.required("Document is required for staff"),
      otherwise: (schema) => schema.notRequired(),
    }),
    fileType: Yup.string().when("fileS3Key", {
      is: (val: string) => !!val,
      then: (schema) => schema.required("Select file type"),
    }),
    stores: Yup.array().when("userType", {
      is: "store_owner",
      then: (schema) => schema.min(1, "Select at least one store"),
    }),
  });

  const handleStoreSelect = (selectedValue: string, values: any, setFieldValue: any) => {
    if (!selectedValue) return;

    // Add to selected stores
    const newStores = [...values.stores, selectedValue];
    setFieldValue("stores", newStores);

    // Update available stores by filtering out the selected one
    const updatedAvailableStores = availableStores.filter(
      store => store.value !== selectedValue
    );
    setAvailableStores(updatedAvailableStores);
  };

  const removeStore = (storeToRemove: string, values: any, setFieldValue: any) => {

    const newStores = values.stores.filter((store: string) => store !== storeToRemove);
    setFieldValue("stores", newStores);

    const storeToAddBack = allStoreOptions.find(store => store.value === storeToRemove);
    if (storeToAddBack) {
      setAvailableStores([...availableStores, storeToAddBack]);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingUsers ? "Edit User" : "Add User"}
      width="max-w-2xl"
    >
      <Formik
        initialValues={{
          ...emptyInitialValues,
          ...(editingUsers || {}),
        }}
        validationSchema={UsersSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ values, handleChange, setFieldValue, errors, touched }) => (
          <Form className="space-y-6">

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Name <span className="text-red-500">*</span>
              </label>
              <InputField
                name="name"
                placeholder="Enter name"
                value={values.name}
                onChange={handleChange}
                error={touched.name ? errors.name : ""}
              />
            </div>


            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                User Type <span className="text-red-500">*</span>
              </label>
              <SelectField
                name="userType"
                value={values.userType}
                onChange={handleChange}
                options={[
                  { label: "Staff", value: "staff" },
                  { label: "Store Owner", value: "store_owner" },
                ]}
                error={touched.userType ? errors.userType : ""}
              />
            </div>


            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Upload Document{" "}
                {values.userType === "staff" && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <FileUploader
                value={values.fileS3Key}
                onChange={(key) => setFieldValue("fileS3Key", key)}
                path="user-documents"
                type="all"
                pathId={id}
                error={
                  touched.fileS3Key && errors.fileS3Key
                    ? errors.fileS3Key
                    : ""
                }
              />
            </div>


            {values.fileS3Key && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  File Type <span className="text-red-500">*</span>
                </label>
                <SelectField
                  name="fileType"
                  value={values.fileType}
                  onChange={handleChange}
                  options={fileTypeOptions}
                  error={touched.fileType ? errors.fileType : ""}
                />
              </div>
            )}


            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Expiry Date
              </label>
              <DatePickerField
                name="expiresAt"
                value={values.expiresAt}
                onChange={(val) => setFieldValue("expiresAt", val)}
              />
            </div>


            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Remind Before (days)
              </label>
              <InputField
                placeholder="Remind Before (days)"
                name="remindBeforeDays"
                type="number"
                value={String(values.remindBeforeDays)}
                onChange={handleChange}
              />
            </div>

            {values.userType === "store_owner" && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Select Stores <span className="text-red-500">*</span>
                </label>
                <MultiSelect
                  name="stores"
                  value={values.stores}
                  onChange={(val) => setFieldValue("stores", val)}
                  options={allStoreOptions}
                  placeholder="Select stores"
                  error={touched.stores ? (errors.stores as string) : ""}
                />
              </div>
            )}



            <div className="flex justify-end gap-2">
              <Button type="button" variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="btn" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default UsersTypeModal;
