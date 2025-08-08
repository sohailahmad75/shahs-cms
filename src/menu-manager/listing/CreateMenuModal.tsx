import React from "react";
import Modal from "../../components/Modal";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { useCreateMenuMutation } from "../../services/menuApi";
import { toast } from "react-toastify";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FileUploader from "../../components/FileUploader";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const MenuSchema = Yup.object().shape({
  name: Yup.string().required("Menu name is required"),
  description: Yup.string(),
  s3Key: Yup.string().required("Menu image is required"),
});

const CreateMenuModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [createMenu, { isLoading }] = useCreateMenuMutation();

  const handleSubmit = async (
    values: { name: string; description: string; s3Key: string },
    { resetForm }: any,
  ) => {
    await createMenu(values).unwrap();
    toast.success("Menu created successfully");
    resetForm();
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Menu">
      <Formik
        initialValues={{ name: "", description: "", s3Key: "" }}
        validationSchema={MenuSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, setFieldValue, errors, touched }) => (
          <Form className="space-y-4">
            <InputField
              name="name"
              label="Menu Name"
              placeholder="Enter menu name"
              value={values.name}
              onChange={handleChange}
              error={touched.name && errors.name ? errors.name : ""}
            />

            <InputField
              name="description"
              type="textarea"
              label="Description"
              placeholder="Brief description of the menu"
              value={values.description}
              onChange={handleChange}
              rows={3}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Menu Image <span className="text-red-500">*</span>
              </label>

              <FileUploader
                value={values.s3Key}
                onChange={(key) => setFieldValue("s3Key", key)}
                path="menu-banner"
                type="image"
                error={touched.s3Key && errors.s3Key ? errors.s3Key : ""}
              />
            </div>

            <Button type="submit" loading={isLoading} className="w-full">
              Create Menu
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreateMenuModal;
