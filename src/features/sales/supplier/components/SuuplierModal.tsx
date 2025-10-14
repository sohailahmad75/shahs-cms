import { Formik, Form } from "formik";
import * as Yup from "yup";
import Modal from "../../../../components/Modal";
import Button from "../../../../components/Button";
import type { Supplier } from "../Supplier.types";
import InputField from "../../../../components/InputField";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Pick<Supplier, "name" | "description">) => void | Promise<void>;
  editingCategory?: Partial<Supplier>;
  isSubmitting?: boolean;
};

const Schema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Too short")
    .max(160, "Too long")
    .required("Name is required"),
  description: Yup.string()
    .trim()
    .min(2, "Too short")
    .max(500, "Too long")
    .optional(),
});

export default function SupplierModal({
  isOpen,
  onClose,
  onSubmit,
  editingCategory,
  isSubmitting,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingCategory?.id ? "Edit Category" : "Add Category"}
    >
      <Formik
        initialValues={{
          name: editingCategory?.name ?? "",
          description: editingCategory?.description ?? "",
        }}
        validationSchema={Schema}
        onSubmit={async (vals) => {
          await onSubmit(vals);
        }}
        enableReinitialize
      >
        {({ values, handleChange, handleSubmit, errors, touched }) => (
          <Form className="space-y-4" onSubmit={handleSubmit}>
            <InputField
              label="Category Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              error={touched.name ? (errors.name as string) : undefined}
              placeholder="e.g., Wraps"
            />
            <InputField
              label="Description"
              name="description"
              value={values.description}
              onChange={handleChange}
              error={touched.description ? (errors.description as string) : undefined}
              placeholder="e.g., Category for all wrap products"
              type="textarea"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}