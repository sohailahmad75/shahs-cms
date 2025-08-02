import React, { useCallback, useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Modal from "../../../components/Modal";
import InputField from "../../../components/InputField";
import DatePickerField from "../../../components/DatePickerField";
import SelectField from "../../../components/SelectField";
import Button from "../../../components/Button";
import { useDropzone } from 'react-dropzone';
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

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

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);

    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    setTimeout(() => {
      const mockFileKey = `documents/${defaultOwnerType}s/${initialValues.ownerId}/${file.name}`;
      setInitialValues(prev => ({ ...prev, fileS3Key: mockFileKey }));
      setIsUploading(false);
    }, 1500);
  }, [defaultOwnerType, initialValues.ownerId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const removeImage = () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(null);
    setInitialValues(prev => ({ ...prev, fileS3Key: "" }));
  };

  useEffect(() => {
    if (editingDocument) {
      setInitialValues({
        ...initialValues,
        ...editingDocument,
      });
      // If editing and there's an existing file, you might want to set a preview
      // This would require fetching the image from your server
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

              {previewImage ? (
                <div className="relative group">
                  {values.fileS3Key.endsWith('.pdf') ? (
                    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-lg font-medium">PDF Document</p>
                        <p className="text-sm text-gray-500">{values.fileS3Key.split('/').pop()}</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 shadow-sm transition-all"
                  >
                    <XMarkIcon className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-300 hover:border-indigo-400"
                    }`}
                >
                  <input {...getInputProps()} />
                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                      <p className="text-sm text-gray-600">Uploading file...</p>
                    </div>
                  ) : (
                    <>
                      <div className="mx-auto h-10 w-10 text-gray-400 mb-2">
                        <ArrowUpTrayIcon />
                      </div>
                      <p className="text-sm text-gray-600">
                        {isDragActive
                          ? "Drop the file here"
                          : "Drag & drop a file here, or click to select"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        JPEG, PNG, WEBP, PDF, DOC (Max. 5MB)
                      </p>
                    </>
                  )}
                </div>
              )}
              {touched.fileS3Key && errors.fileS3Key && (
                <p className="mt-1 text-sm text-red-600">{errors.fileS3Key}</p>
              )}
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