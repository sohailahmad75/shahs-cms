import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "../assets/styledIcons/HomeIcon";
import Button from "../components/Button";
import AddIcon from "../assets/styledIcons/AddIcon";
import { toast } from "react-toastify";
import {
  useDeleteMenuMutation,
  useDuplicateMenuMutation,
  useGenerateDefaultMenuMutation,
  useGetMenusQuery,
} from "../services/menuApi";
import Loader from "../components/Loader";
import ThreeDotsVerticalIcon from "../assets/styledIcons/ThreeDotsVerticalIcon";
import DropdownMenu from "../components/DropdownMenu";
import EditIcon from "../assets/styledIcons/EditIcon";
import CreateMenuModal from "./listing/CreateMenuModal";

const MenuActions: React.FC<{ menu: any }> = ({ menu }) => {
  const [duplicateMenu, { isLoading: isDuplicating }] =
    useDuplicateMenuMutation();
  const [deleteMenu, { isLoading: isDeleting }] = useDeleteMenuMutation();

  const handleDuplicate = async () => {
    await duplicateMenu({ menuId: menu.id }).unwrap();
    toast.success("Menu duplicated successfully");
  };

  const handleDelete = async () => {
    if (menu.storeMenus?.length > 0) return;

    await deleteMenu({ menuId: menu.id }).unwrap();
    toast.success("Menu deleted successfully");
  };

  return (
    <DropdownMenu
      loading={isDuplicating || isDeleting}
      trigger={
        <Button
          variant="outlined"
          icon={<ThreeDotsVerticalIcon rotation={90} />}
        />
      }
      items={[
        {
          label: "Duplicate Menu",
          onClick: handleDuplicate,
        },
        {
          disabled: menu.storeMenus?.length > 0,
          label: "Delete Menu",
          onClick: handleDelete,
        },
      ]}
    />
  );
};

const MenuManager: React.FC = () => {
  const navigate = useNavigate();

  const { data: menus = [], isFetching } = useGetMenusQuery();

  const [generateDefaultMenu, { isLoading: isDefaultMenuLoading }] =
    useGenerateDefaultMenuMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleGenerate = async () => {
    await generateDefaultMenu({}).unwrap();
    toast.success("Default menu generated");
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
        <Loader />
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
              className="bg-white rounded-md shadow-sm flex flex-col"
            >
              <div className="relative w-full pt-[50%] overflow-hidden rounded">
                <img
                  src={menu.signedUrl}
                  alt={menu.name}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between">
                <div className="flex items-center">
                  <h2 className="font-semibold text-lg line-clamp-1 overflow-hidden text-ellipsis">
                    {menu.name}
                  </h2>
                  <span className="ml-2 text-gray-500 text-sm cursor-pointer">
                    <EditIcon className="text-orange-100 shrink-0 " />
                  </span>
                </div>

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

                <div className="flex gap-2">
                  <Button
                    onClick={() => navigate(`/menus/${menu.id}/categories`)}
                    className="w-full text-xs font-semibold"
                  >
                    Edit Menu
                  </Button>

                  <MenuActions menu={menu} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateMenuModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default MenuManager;
