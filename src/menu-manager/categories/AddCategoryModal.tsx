import React from "react";
import Modal from "../../components/Modal";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { useCreateCategoryMutation } from "../../services/menuApi";
import { toast } from "react-toastify";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FileUploader from "../../components/FileUploader";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  menuId: string;
};

const CategorySchema = Yup.object().shape({
  name: Yup.string().required("Category name is required"),
  description: Yup.string(),
  s3Key: Yup.string().required("Category image is required"),
});

const AddCategoryModal: React.FC<Props> = ({ isOpen, onClose, menuId }) => {
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const handleSubmit = async (
    values: { name: string; s3Key: string },
    { resetForm }: any,
  ) => {
    try {
      await createCategory({
        menuId,
        payload: {
          name: values.name,
          s3Key: values.s3Key,
        },
      }).unwrap();

      toast.success("Category created successfully");
      resetForm();
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create category");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Category">
      <Formik
        initialValues={{ name: "", s3Key: "", description: "" }}
        validationSchema={CategorySchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, errors, touched, setFieldValue }) => (
          <Form className="flex flex-col h-full space-y-4">
            <div className="space-y-4 flex-1 mt-4">
              <InputField
                name="name"
                label="Category Name"
                placeholder="e.g. Platters"
                value={values.name}
                onChange={handleChange}
                error={touched.name && errors.name ? errors.name : ""}
              />
              <InputField
                name="description"
                type="textarea"
                label="Description"
                placeholder="Brief description of the category"
                value={values.description}
                onChange={handleChange}
                rows={3}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Image <span className="text-red-500">*</span>
                </label>

                <FileUploader
                  value={values.s3Key}
                  onChange={(key) => setFieldValue("s3Key", key)}
                  path="menu-categories"
                  type="image"
                  error={touched.s3Key && errors.s3Key ? errors.s3Key : ""}
                />
              </div>
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
