import React from "react";
import Modal from "../../components/Modal";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { useCreateCategoryMutation } from "../../services/menuApi";
import { toast } from "react-toastify";
import { Formik, Form } from "formik";
import * as Yup from "yup";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  menuId: string;
};

// Validation schema
const CategorySchema = Yup.object().shape({
  name: Yup.string().required("Category name is required"),
  image: Yup.string().url("Enter a valid image URL").nullable(),
});

const AddCategoryModal: React.FC<Props> = ({ isOpen, onClose, menuId }) => {
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const handleSubmit = async (
    values: { name: string; image: string },
    { resetForm }: any,
  ) => {
    try {
      await createCategory({ menuId, payload: values }).unwrap();
      toast.success("Category created");
      onClose();
      resetForm();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create category");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Category">
      <Formik
        initialValues={{ name: "", image: "" }}
        validationSchema={CategorySchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, errors, touched }) => (
          <Form className="flex flex-col h-full space-y-4">
            <div className="space-y-4 flex-1 mt-10">
              <InputField
                name="name"
                placeholder="Category name"
                value={values.name}
                onChange={handleChange}
                error={touched.name && errors.name ? errors.name : ""}
              />
              <InputField
                name="image"
                placeholder="Image URL"
                value={values.image}
                onChange={handleChange}
                error={touched.image && errors.image ? errors.image : ""}
              />
            </div>

            <Button type="submit" loading={isLoading} className="w-full">
              Create Category
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddCategoryModal;
