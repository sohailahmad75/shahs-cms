import React, { useCallback, useState } from "react";
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
import { useDropzone } from 'react-dropzone';
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";

export interface StoreBasicInfo {
  id: string;
  name: string;
  companyName: string;
}

export interface StoreMenu {
  isPublished: any;
  id: number;
  storeId: string;
  menuId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  store: StoreBasicInfo;
}

export interface Menu {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
  storeMenus: StoreMenu[];
}

const MenuManager: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menu, setMenu] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);

    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);

    setTimeout(() => {
      setIsUploading(false);
      setMenu(prev => ({ ...prev, image: `https://example.com/uploads/${file.name}` }));
    }, 1500);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024
  });

  const removeImage = () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(null);
    setMenu(prev => ({ ...prev, image: "" }));
  };

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setMenu((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    if (!menu.name.trim()) return toast.error("Menu name is required");

    try {
      await createMenu(menu).unwrap(); // Triggers refetch via invalidatesTags
      toast.success("Menu created successfully");
      setIsModalOpen(false);
      setMenu({ name: "", description: "", image: "" });
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
            onClick={() => handleGenerate()}
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
                  src={menu.image}
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

      {/* <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Menu"
      >
        <div className="space-y-4">
          <InputField
            name="name"
            placeholder="Menu name"
            value={menu.name}
            onChange={handleChange}
          />
          <InputField
            name="description"
            type="textarea"
            placeholder="Menu description"
            value={menu.description}
            onChange={handleChange}
          />
          <InputField
            name="image"
            placeholder="Image URL"
            value={menu.image}
            onChange={handleChange}
          />
          <Button className="w-full" onClick={handleCreate} loading={isLoading}>
            Create Menu
          </Button>
        </div>
      </Modal> */}


      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (previewImage) {
            URL.revokeObjectURL(previewImage);
            setPreviewImage(null);
          }
        }}
        title="Create New Menu"
      >
        <div className="space-y-4">
          <InputField
            name="name"
            label="Menu Name"
            placeholder="e.g. Summer Specials"
            value={menu.name}
            onChange={handleChange}
            required
          />

          <InputField
            name="description"
            type="textarea"
            label="Description"
            placeholder="Brief description of the menu"
            value={menu.description}
            onChange={handleChange}
            rows={3}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Menu Image {!menu.image && <span className="text-red-500">*</span>}
            </label>

            {previewImage ? (
              <div className="relative group">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 shadow-sm transition-all"
                >
                  <XMarkIcon className="w-5 h-5 text-red-500" />
                </button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-300 hover:border-indigo-400"
                  }`}
              >
                <input {...getInputProps()} />
                {isUploading ? (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                    <p className="text-sm text-gray-600">
                      Uploading image...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mx-auto h-10 w-10 text-gray-400 mb-2">
                      <ArrowUpTrayIcon />
                    </div>
                    <p className="text-sm text-gray-600">
                      {isDragActive
                        ? "Drop the image here"
                        : "Drag & drop an image here, or click to select"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      JPEG, PNG, WEBP (Max. 5MB)
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="pt-2">
            <Button
              onClick={handleCreate}
              loading={isLoading}
              disabled={!menu.name || !menu.image}
              className="w-full"
            >
              Create Menu
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default MenuManager;
