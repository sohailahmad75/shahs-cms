import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "../assets/styledIcons/HomeIcon";
import Button from "../components/Button";
import AddIcon from "../assets/styledIcons/AddIcon";
import Modal from "../components/Modal";
import InputField from "../components/InputField";
import { toast } from "react-toastify";
import { useCreateMenuMutation, useGetMenusQuery } from "../services/menuApi";

export interface Menu {
  id: string;
  name: string;
  description: string;
  storeCount: number;
  menus?: number;
  image: string;
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
        <Button onClick={() => setIsModalOpen(true)}>
          <AddIcon /> Add New
        </Button>
      </div>

      {isFetching ? (
        <p>Loading menus...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map((menu) => (
            <div key={menu.id} className="bg-white p-6 shadow-sm rounded-md">
              <img
                src={menu.image}
                alt={menu.name}
                className="w-full h-80 object-cover rounded-md"
              />
              <div className="p-4">
                <h2 className="font-semibold text-lg">{menu.name}</h2>
                <div className="text-gray-600 text-sm mt-2 space-y-1">
                  <div className="flex items-center gap-2 py-2 justify-between">
                    <div className="flex items-center gap-2">
                      <HomeIcon /> {menu.storeCount} store
                      {menu.storeCount !== 1 && "s"}
                    </div>

                    {menu.storeCount <= 0 && (
                      <span className="ml-2 rounded bg-red-100 text-xs font-medium text-red-600 px-3 py-1">
                        Inactive
                      </span>
                    )}
                  </div>
                  <hr className="border-gray-200 my-6" />
                </div>
                <div className="mt-4">
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/menus/${menu.id}/categories`)}
                    className="!w-full"
                  >
                    Edit menu
                  </Button>
                </div>
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
