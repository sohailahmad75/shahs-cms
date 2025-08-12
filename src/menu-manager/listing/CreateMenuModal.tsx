// listing/CreateMenuModal.tsx
import React from "react";
import Modal from "../../components/Modal";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import {
  useCreateMenuMutation,
  useUpdateMenuMutation,
} from "../../services/menuApi";
import { toast } from "react-toastify";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FileUploader from "../../components/FileUploader";

type Props = {
  isOpen: boolean;
  isUpdate?: boolean;
  menu?:
    | { id: number; name: string; description?: string; s3Key?: string }
    | undefined;
  onClose: () => void;
};

const MenuSchema = Yup.object().shape({
  name: Yup.string().required("Menu name is required"),
  description: Yup.string(),
  s3Key: Yup.string().required("Menu image is required"),
});

const MenuUpdateSchema = Yup.object().shape({
  name: Yup.string().required("Menu name is required"),
});

const CreateMenuModal: React.FC<Props> = ({
  isOpen,
  onClose,
  isUpdate = false,
  menu,
}) => {
  const [createMenu, { isLoading: isCreating }] = useCreateMenuMutation();
  const [updateMenu, { isLoading: isUpdating }] = useUpdateMenuMutation();

  const handleSubmit = async (
    values: { name: string; description: string; s3Key: string },
    { resetForm }: any,
  ) => {
    if (isUpdate && menu?.id) {
      await updateMenu({ menuId: menu.id, name: values.name }).unwrap();
      toast.success("Menu name updated");
    } else {
      await createMenu(values).unwrap();
      toast.success("Menu created successfully");
    }
    resetForm();
    onClose();
  };

  const initialValues = {
    name: menu?.name ?? "",
    description: menu?.description ?? "",
    s3Key: menu?.s3Key ?? "",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isUpdate ? "Update Menu" : "Create New Menu"}
    >
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={isUpdate ? MenuUpdateSchema : MenuSchema}
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
              error={touched.name && errors.name ? (errors.name as string) : ""}
            />

            {/* In UPDATE mode we ONLY allow changing the name */}
            {!isUpdate && (
              <>
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
                    error={
                      touched.s3Key && errors.s3Key
                        ? (errors.s3Key as string)
                        : ""
                    }
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              loading={isCreating || isUpdating}
              className="w-full"
            >
              {isUpdate ? "Update Menu" : "Create Menu"}
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreateMenuModal;
