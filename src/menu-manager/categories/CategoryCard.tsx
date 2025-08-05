import React, { useState } from "react";
import MenuItemCard from "./MenuItemCard";
import Button from "../../components/Button";
import ArrowIcon from "../../assets/styledIcons/ArrowIcon";
import AddItemModal from "../items/AddItemModal";
import type { MenuCategory } from "../../types";
import AddIcon from "../../assets/styledIcons/AddIcon";

interface CategoryProps {
  category: MenuCategory;
  isExpanded: boolean;
  setExpanded: (expanded: boolean) => void;
  menuCategories: { id: string; name: string }[];
}

const CategoryCard: React.FC<CategoryProps> = ({
  category,
  isExpanded,
  setExpanded,
  menuCategories,
}) => {
  const [imageError, setImageError] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);

  const hasValidImage = category.signedUrl && !imageError;

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 mb-6 border border-gray-100">
      <div className="flex justify-between items-center mb-2 pb-2">
        <div className="flex items-center gap-3">
          {hasValidImage ? (
            <img
              src={category.signedUrl}
              alt={category.name}
              onError={() => setImageError(true)}
              className="w-16 h-16 rounded object-cover border border-gray-200"
            />
          ) : (
            <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-500 border border-gray-200 text-center">
              No Image
            </div>
          )}

          <h3 className="text-lg font-semibold">{category.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {category?.items?.length} Items
          </span>
          <Button
            variant="outlined"
            className="!p-1 !border-none"
            onClick={() => setExpanded(!isExpanded)}
          >
            <ArrowIcon
              size={16}
              className={isExpanded ? "rotate-180" : "rotate-0"}
            />
          </Button>
        </div>
      </div>

      <hr className="mb-5 border-gray-200" />

      {isExpanded && (
        <>
          <div className="mb-4">
            {category?.items?.length ? (
              <div className="grid md:grid-cols-2 gap-4">
                {category.items.map((item: any) => (
                  <MenuItemCard key={item.name} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic px-2 py-4 text-center border border-dashed border-gray-200 rounded">
                No items in this category yet.
              </div>
            )}
          </div>

          <div className="flex gap-2 text-blue-600 text-sm font-medium flex-wrap">
            <Button
              onClick={() => setShowAddItem(true)}
              variant="outlined"
              className="w-full sm:w-auto"
            >
              <AddIcon size={18} /> Create new item
            </Button>
            <Button
              variant="outlined"
              className="w-full sm:w-auto"
              icon={<AddIcon />}
            >
              Add existing items
            </Button>
          </div>

          {showAddItem && (
            <AddItemModal
              isOpen={showAddItem}
              onClose={() => setShowAddItem(false)}
              categories={menuCategories}
              selectedCategory={category}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CategoryCard;
