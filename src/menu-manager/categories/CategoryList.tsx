import React, { useState } from "react";
import CategoryCard from "./CategoryCard";
import Button from "../../components/Button";
import CollapseIcon from "../../assets/styledIcons/CollapseIcon";
import ExpandIcon from "../../assets/styledIcons/ExpandIcon";
import { useGetMenuCategoriesQuery } from "../../services/menuApi";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import AddIcon from "../../assets/styledIcons/AddIcon";
import { useTheme } from "../../context/themeContext";
import AddCategoryModal from "./AddCategoryModal";
import type { MenuCategory } from "../menu.types";

const CategoryList: React.FC = () => {
  const { id: menuId = "" } = useParams();
  const {
    data: categories = [],
    isLoading,
    refetch,
  } = useGetMenuCategoriesQuery(menuId);

  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isDarkMode } = useTheme();

  const toggleAll = (expand: boolean) => {
    const newState: Record<string, boolean> = {};
    categories.forEach((cat) => {
      newState[cat.name] = expand;
    });
    setExpandedCategories(newState);
  };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outlined" onClick={() => toggleAll(false)}>
                <CollapseIcon />{" "}
                <span className="hidden sm:inline">Collapse all</span>
              </Button>
              <Button variant="outlined" onClick={() => toggleAll(true)}>
                <ExpandIcon />{" "}
                <span className="hidden sm:inline">Expand all</span>
              </Button>
            </div>
            <Button onClick={() => setIsModalOpen(true)} icon={<AddIcon />}>
              <span className="hidden sm:inline">Add Category</span>
            </Button>
          </div>

          <div
            className={`space-y-6 mt-10  ${isDarkMode ? "bg-slate-900" : "bg-white"} p-6 rounded shadow-sm`}
          >
            {categories.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">
                No categories found
              </p>
            ) : (
              categories?.map((cat: MenuCategory) => (
                <CategoryCard
                  refetchData={refetch}
                  key={cat.id}
                  category={cat}
                  isExpanded={expandedCategories[cat.name] ?? true}
                  setExpanded={(val) =>
                    setExpandedCategories((prev) => ({
                      ...prev,
                      [cat.name]: val,
                    }))
                  }
                  menuCategories={categories.map((c) => ({
                    id: c.id,
                    name: c.name,
                  }))}
                />
              ))
            )}
          </div>
        </>
      )}

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        menuId={menuId}
      />
    </>
  );
};

export default CategoryList;
