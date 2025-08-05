import React, { useCallback, useState } from "react";
import Modal from "../../components/Modal";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import Button from "../../components/Button";
import { useCreateItemMutation } from "../../services/menuApi";
import { toast } from "react-toastify";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import type { MenuCategory } from "../../types";
import FileUploader from "../../components/FileUploader";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  categories: { id: string; name: string }[];
  selectedCategory: MenuCategory;
};

const AddItemSchema = Yup.object().shape({
  name: Yup.string().required("Item name is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .required("Price is required"),
  deliveryPrice: Yup.number()
    .typeError("Delivery Price must be a number")
    .required("Delivery Price is required"),
  categoryId: Yup.string().required("Category is required"),
  s3Key: Yup.string().required("Item image is required"),
});

const AddItemModal: React.FC<Props> = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
}) => {
  const [createItem, { isLoading }] = useCreateItemMutation();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const initialValues = {
    name: "",
    description: "",
    price: "",
    deliveryPrice: "",
    s3Key: "",
    categoryId: selectedCategory?.id || "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await createItem({
        categoryId: values.categoryId,
        payload: {
          ...values,
          categoryId: undefined,
          price: parseFloat(values.price),
          deliveryPrice: parseFloat(values.deliveryPrice),
        },
      }).unwrap();

      toast.success("Item created");
      onClose();
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
        setPreviewImage(null);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create item");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        if (previewImage) {
          URL.revokeObjectURL(previewImage);
          setPreviewImage(null);
        }
      }}
      title="Add New Item"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={AddItemSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, errors, touched, setFieldValue }) => (
          <Form className="space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Item name <span className="text-red-500">*</span>
                </label>
                <InputField
                  name="name"
                  placeholder="Item name"
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
                  Price <span className="text-red-500">*</span>
                </label>
                <InputField
                  name="price"
                  type="number"
                  placeholder="Price"
                  value={values.price}
                  onChange={handleChange}
                  error={touched.price ? errors.price : ""}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Delivery Price <span className="text-red-500">*</span>
                </label>
                <InputField
                  name="deliveryPrice"
                  type="number"
                  placeholder="Delivery Price"
                  value={values.deliveryPrice}
                  onChange={handleChange}
                  error={touched.deliveryPrice ? errors.deliveryPrice : ""}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Category <span className="text-red-500">*</span>
                </label>
                <SelectField
                  name="categoryId"
                  value={values.categoryId}
                  onChange={handleChange}
                  options={categories.map((c) => ({
                    label: c.name,
                    value: c.id,
                  }))}
                  placeholder="Select category"
                  error={touched.categoryId ? errors.categoryId : ""}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Item Image
                </label>

                <FileUploader
                  value={values.s3Key}
                  onChange={(key) => setFieldValue("s3Key", key)}
                  path="menu-items"
                  type="image"
                  error={touched.s3Key && errors.s3Key ? errors.s3Key : ""}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" loading={isLoading}>
              Create Item
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddItemModal;
