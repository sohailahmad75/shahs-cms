import React, { useEffect } from "react";
import Modal from "../../components/Modal";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import Button from "../../components/Button";
import { useCreateItemMutation } from "../../services/menuApi";
import { toast } from "react-toastify";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import type { MenuCategory } from "../../types";

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
  categoryId: Yup.string().required("Category is required"),
});

const AddItemModal: React.FC<Props> = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
}) => {
  const [createItem, { isLoading }] = useCreateItemMutation();

  const initialValues = {
    name: "",
    description: "",
    price: "",
    image: "",
    categoryId: selectedCategory?.id || "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await createItem({
        categoryId: values.categoryId,
        payload: {
          name: values.name,
          description: values.description,
          image: values.image,
          price: parseFloat(values.price),
        },
      }).unwrap();

      toast.success("Item created");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create item");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Item">
      <Formik
        initialValues={initialValues}
        validationSchema={AddItemSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, errors, touched }) => (
          <Form className="space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <InputField
                name="name"
                placeholder="Item name"
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
                name="price"
                type="number"
                placeholder="Price"
                value={values.price}
                onChange={handleChange}
                error={touched.price ? errors.price : ""}
              />
              <InputField
                name="image"
                placeholder="Image URL"
                value={values.image}
                onChange={handleChange}
              />
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
