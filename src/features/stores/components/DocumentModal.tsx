import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Modal from "../../../components/Modal";
import InputField from "../../../components/InputField";
import DatePickerField from "../../../components/DatePickerField";
import SelectField from "../../../components/SelectField";
import Button from "../../../components/Button";
import { toast } from "react-toastify";
import FileUploader from "../../../components/FileUploader";
import { useParams } from "react-router-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  isSubmitting?: boolean;
  editingDocument?: any;
};

const DocumentSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  fileS3Key: Yup.string().required("File is required"),
  documentType: Yup.string().required("Select a document type"),
});

const DocumentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  editingDocument,
}) => {
  const [initialValues, setInitialValues] = useState({
    name: "",
    fileS3Key: "",
    expiresAt: "",
    documentType: "",
    remindBeforeDays: 7,
  });
  const { id } = useParams();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (editingDocument) {
      setInitialValues({
        ...initialValues,
        ...editingDocument,
      });
    }
  }, [editingDocument]);

  const handleFormSubmit = (values: typeof initialValues) => {
    if (!values.fileS3Key) {
      toast.error("Please upload a file");
      return;
    }
    onSubmit(values);
  };

  return (
    <Modal
      title={editingDocument ? "Edit Document" : "Add Document"}
      isOpen={isOpen}
      onClose={() => {
        onClose();
        if (previewImage) {
          URL.revokeObjectURL(previewImage);
          setPreviewImage(null);
        }
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={DocumentSchema}
        enableReinitialize
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, touched, handleChange, setFieldValue }) => (
          <Form className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Document File <span className="text-red-500">*</span>
              </label>

              <FileUploader
                value={values.fileS3Key}
                onChange={(key) => setFieldValue("fileS3Key", key)}
                path="store-documents"
                type="all"
                error={
                  touched.fileS3Key && errors.fileS3Key ? errors.fileS3Key : ""
                }
                pathId={id}
              />
            </div>

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
              name="documentType"
              value={values.documentType}
              onChange={handleChange}
              options={[
                { label: "Passport", value: "passport" },
                { label: "FSA Cert", value: "fsa_cert" },
                { label: "License", value: "license" },
              ]}
              error={touched.documentType ? errors.documentType : ""}
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
