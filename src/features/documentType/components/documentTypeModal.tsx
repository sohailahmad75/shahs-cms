import { Formik, Form } from "formik";
import * as Yup from "yup";
import Modal from "../../../components/Modal";
import InputField from "../../../components/InputField";
import Button from "../../../components/Button";
import type {UpdateDocumentDto } from "../documentTypes.types";

const DocumentSchema = Yup.object().shape({
  documentName: Yup.string().required("Document Name is required"),
  documentDescription: Yup.string().nullable(),
});

const emptyInitialValues = {
  documentName: "",
  documentDescription: "",
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
      title={editingDocument ? "Edit Document" : "Add Document"}
      width="max-w-2xl"
    >
      <Formik
        initialValues={{
          ...emptyInitialValues,
          ...(editingDocument
            ? {
                documentName: editingDocument.documentName ?? "",
                documentDescription: editingDocument.documentDescription ?? "",
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
                Document Details
              </span>
              <div className="flex-grow h-px bg-gray-200" />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Document Name <span className="text-red-500">*</span>
                </label>
                <InputField
                  name="documentName"
                  placeholder="Enter Document Name"
                  value={values.documentName}
                  onChange={handleChange}
                  error={touched.documentName ? errors.documentName : ""}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Document Description
                </label>
                <InputField
                  name="documentDescription"
                  placeholder="Enter Document Description"
                  value={values.documentDescription}
                  onChange={handleChange}
                  error={
                    touched.documentDescription
                      ? errors.documentDescription
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
