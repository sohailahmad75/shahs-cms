// src/features/products/components/ProductCategoryModal.tsx
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Modal from "../../../../components/Modal";
import Button from "../../../../components/Button";
import type { ProductCategory } from "../productCategory.types";
import InputField from "../../../../components/InputField";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Pick<ProductCategory, "name">) => void | Promise<void>;
  editingCategory?: Partial<ProductCategory>;
  isSubmitting?: boolean;
};

const Schema = Yup.object({
  sku: Yup.string()
    .trim()
    .min(2, "Too short")
    .max(160, "Too long")
    .required("Name is required"),
  name: Yup.string()
    .trim()
    .min(2, "Too short")
    .max(160, "Too long")
    .required("Name is required"),
});

export default function ProductCategoryModal({
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
          sku: editingCategory?.sku ?? "",
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
              label="SKU"
              name="sku"
              value={values.name}
              onChange={handleChange}
              error={touched.sku ? (errors.sku as string) : undefined}
              placeholder="e.g., Wraps"
            />
            <InputField
              label="Category Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              error={touched.name ? (errors.name as string) : undefined}
              placeholder="e.g., Wraps"
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
