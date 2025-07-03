import React, { useState } from "react";
import CategoryCard from "./CategoryCard";
import Button from "../../components/Button";
import CollapseIcon from "../../assets/styledIcons/CollapseIcon";
import ExpandIcon from "../../assets/styledIcons/ExpandIcon";
import { useGetMenuCategoriesQuery } from "../../services/menuApi";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import AddIcon from "../../assets/styledIcons/AddIcon";

import AddCategoryModal from "./AddCategoryModal";

const CategoryList: React.FC = () => {
  const { id: menuId = "" } = useParams();
  const { data: categories = [], isLoading } =
    useGetMenuCategoriesQuery(menuId);

  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <div className="flex gap-2 mb-4 justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outlined" onClick={() => toggleAll(false)}>
                <CollapseIcon /> Collapse all
              </Button>
              <Button variant="outlined" onClick={() => toggleAll(true)}>
                <ExpandIcon /> Expand all
              </Button>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <AddIcon /> Add Category
            </Button>
          </div>

          <div className="space-y-6 mt-10 bg-white p-6 rounded shadow-sm">
            {categories.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">
                No categories found
              </p>
            ) : (
              categories?.map((cat) => (
                <CategoryCard
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
