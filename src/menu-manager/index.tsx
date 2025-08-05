import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "../assets/styledIcons/HomeIcon";
import Button from "../components/Button";
import AddIcon from "../assets/styledIcons/AddIcon";
import Modal from "../components/Modal";
import InputField from "../components/InputField";
import { toast } from "react-toastify";
import {
  useCreateMenuMutation,
  useGenerateDefaultMenuMutation,
  useGetMenusQuery,
} from "../services/menuApi";
import FileUploader from "../components/FileUploader";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const MenuSchema = Yup.object().shape({
  name: Yup.string().required("Menu name is required"),
  description: Yup.string(),
  s3Key: Yup.string().required("Menu image is required"),
});

const MenuManager: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: menus = [], isFetching } = useGetMenusQuery();
  const [createMenu, { isLoading }] = useCreateMenuMutation();
  const [generateDefaultMenu, { isLoading: isDefaultMenuLoading }] =
    useGenerateDefaultMenuMutation();

  const handleGenerate = async () => {
    try {
      await generateDefaultMenu({}).unwrap();
      toast.success("Default menu generated");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to generate menu");
    }
  };

  const handleSubmit = async (
    values: { name: string; description: string; s3Key: string },
    { resetForm }: any,
  ) => {
    try {
      await createMenu(values).unwrap();
      toast.success("Menu created successfully");
      resetForm();
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create menu");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Menu Manager</h1>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setIsModalOpen(true)} icon={<AddIcon />}>
            Add New
          </Button>
          <Button
            onClick={handleGenerate}
            variant="outlined"
            loading={isDefaultMenuLoading}
            icon={<AddIcon />}
          >
            Default Menu
          </Button>
        </div>
      </div>

      {isFetching ? (
        <p>Loading menus...</p>
      ) : menus.length === 0 ? (
        <div className="p-6 text-center italic text-slate-500 dark:text-slate-400">
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-md py-10 px-6 mx-auto">
            <p className="text-xl font-semibold text-slate-600 mb-2">
              No menus available
            </p>
            <p className="text-sm mb-4">
              You can generate a default menu to get started, or create a new
              one from scratch.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map((menu) => (
            <div
              key={menu.id}
              className="bg-white rounded-md shadow-sm overflow-hidden flex flex-col"
            >
              <div className="relative w-full pt-[50%] overflow-hidden rounded">
                <img
                  src={menu.signedUrl}
                  alt={menu.name}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between">
                <h2 className="font-semibold text-lg line-clamp-1">
                  {menu.name}
                </h2>

                <div className="text-gray-600 text-sm mt-2 space-y-1">
                  <div className="flex items-center justify-between gap-2 py-2 flex-wrap">
                    <div className="flex items-center gap-2 text-sm">
                      <HomeIcon /> {menu?.storeMenus?.length} store
                      {menu?.storeMenus?.length !== 1 && "s"}
                    </div>

                    {menu?.storeMenus?.length <= 0 && (
                      <span className="rounded bg-red-100 text-xs font-medium text-red-600 px-3 py-1 mt-2 sm:mt-0">
                        Inactive
                      </span>
                    )}
                  </div>

                  <hr className="border-gray-200 my-4" />
                </div>

                <Button
                  variant="outlined"
                  onClick={() => navigate(`/menus/${menu.id}/categories`)}
                  className="w-full"
                >
                  Edit Menu
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Modal with Formik */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Menu"
      >
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

                {touched.s3Key && errors.s3Key && (
                  <p className="text-sm text-red-500 mt-1">{errors.s3Key}</p>
                )}
              </div>

              <Button type="submit" loading={isLoading} className="w-full">
                Create Menu
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default MenuManager;
