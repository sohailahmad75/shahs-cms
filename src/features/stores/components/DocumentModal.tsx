import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Modal from "../../../components/Modal";
import InputField from "../../../components/InputField";
import ImageUploadField from "../../../components/ImageUploadField";
import DatePickerField from "../../../components/DatePickerField";
import SelectField from "../../../components/SelectField";
import Button from "../../../components/Button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  isSubmitting?: boolean;
  editingDocument?: any;
  defaultOwnerType: "store" | "user" | "warehouse" | "device";
};

const DocumentSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  fileS3Key: Yup.string().required("File is required"),
  documentTypeId: Yup.string().required("Select a document type"),
});

const DocumentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  editingDocument,
  defaultOwnerType,
}) => {
  const [initialValues, setInitialValues] = useState({
    name: "",
    fileS3Key: "",
    expiresAt: "",
    documentTypeId: "",
    remindBeforeDays: 7,
    ownerType: defaultOwnerType,
    ownerId: "",
  });

  useEffect(() => {
    if (editingDocument) {
      setInitialValues({
        ...initialValues,
        ...editingDocument,
      });
    }
  }, [editingDocument]);

  return (
    <Modal
      title={editingDocument ? "Edit Document" : "Add Document"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={DocumentSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ values, errors, touched, handleChange, setFieldValue }) => (
          <Form className="space-y-4">
            <ImageUploadField
              folder={`documents/${defaultOwnerType}s/${values.ownerId}`}
              value={values.fileS3Key}
              onChange={(fileKey) => setFieldValue("fileS3Key", fileKey)}
            />

            <label className="block mb-1 font-medium text-gray-700">
              File Name
            </label>
            <InputField
              name="name"
              placeholder="File Name"
              value={values.name}
              onChange={handleChange}
              error={touched.name ? errors.name : ""}
            />

            <label className="block mb-1 font-medium text-gray-700">
              File Type
            </label>
            <SelectField
              label="Document Type"
              name="documentTypeId"
              value={values.documentTypeId}
              onChange={handleChange}
              options={[
                { label: "Passport", value: "passport" },
                { label: "FSA Cert", value: "fsa_cert" },
                { label: "License", value: "license" },
              ]}
              error={touched.documentTypeId ? errors.documentTypeId : ""}
            />
            <label className="block mb-1 font-medium text-gray-700">
              Expiry Date
            </label>
            <DatePickerField
              name="expiresAt"
              value={values.expiresAt}
              onChange={(val) => setFieldValue("expiresAt", val)}
            />
            <label className="block mb-1 font-medium text-gray-700">
              Remind Before (days)
            </label>
            <InputField
              placeholder="Remind Before (days)"
              name="remindBeforeDays"
              type="number"
              value={String(values.remindBeforeDays)}
              onChange={handleChange}
            />

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

export default DocumentModal;
