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

export interface StoreSummary {
  id: string;
  name: string;
  companyName: string;
  isActive: boolean;
}
export interface Menu {
  id: string;
  name: string;
  description: string;
  storeCount: number;
  menus?: number;
  image: string;
  storeMenus: StoreSummary[];
}

const MenuManager: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menu, setMenu] = useState({
    name: "",
    description: "",
    image: "",
  });

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
                      <HomeIcon /> {menu.storeCount} store
                      {menu.storeCount !== 1 && "s"}
                    </div>

                    {menu.storeCount <= 0 && (
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

      <Modal
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
      </Modal>
    </div>
  );
};
export default MenuManager;
