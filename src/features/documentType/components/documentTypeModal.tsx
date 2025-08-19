import { Formik, Form } from "formik";
import * as Yup from "yup";
import Modal from "../../../components/Modal";
import InputField from "../../../components/InputField";
import Button from "../../../components/Button";
import type {UpdateDocumentDto } from "../documentTypes.types";

const DocumentSchema = Yup.object().shape({
  name: Yup.string().required("Document Name is required"),
  description: Yup.string().nullable(),
});

const emptyInitialValues = {
  name: "",
  description: "",
};

const DocumentTypeModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingDocument,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: typeof emptyInitialValues) => void;
  editingDocument: UpdateDocumentDto | null | undefined;
  isSubmitting: boolean;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingDocument ? "Edit Document Type" : "Add Document Type"}
      width="max-w-2xl"
    >
      <Formik
        initialValues={{
          ...emptyInitialValues,
          ...(editingDocument
            ? {
                name: editingDocument.name ?? "",
                description: editingDocument.description ?? "",
              }
            : {}),
        }}
        validationSchema={DocumentSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ values, handleChange, touched, errors }) => (
          <Form className="space-y-8">
            <div className="col-span-2 flex items-center gap-6 mb-6">
              <div className="flex-grow h-px bg-gray-200" />
              <span className="text-orange-100 text-md font-medium whitespace-nowrap">
                Document Type Details
              </span>
              <div className="flex-grow h-px bg-gray-200" />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Document Type Name <span className="text-red-500">*</span>
                </label>
                <InputField
                  name="name"
                  placeholder="Enter Document Name"
                  value={values.name}
                  onChange={handleChange}
                  error={touched.name ? errors.name : ""}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Document Type Description
                </label>
                <InputField
                  name="description"
                  placeholder="Enter Document Description"
                  value={values.description}
                  onChange={handleChange}
                  error={
                    touched.description
                      ? errors.description
                      : ""
                  }
                />
              </div>
            </div>

            <Button type="submit" className="w-full" loading={isSubmitting}>
              {editingDocument ? "Update Document" : "Create Document"}
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default DocumentTypeModal;
