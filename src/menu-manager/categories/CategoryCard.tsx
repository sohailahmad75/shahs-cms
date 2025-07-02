import React from "react";
import MenuItemCard from "./MenuItemCard";
import Button from "../../components/Button";
import ArrowIcon from "../../assets/styledIcons/ArrowIcon";

interface MenuItem {
  name: string;
  description: string;
  price: string;
  image: string;
}

interface CategoryProps {
  category: {
    image: string;
    name: string;
    items: MenuItem[];
  };
  isExpanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

const CategoryCard: React.FC<CategoryProps> = ({
  category,
  isExpanded,
  setExpanded,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2 pb-2">
        <div className="flex items-center gap-3">
          <img
            src={category.image}
            alt={category.name}
            className="w-16 h-16 rounded object-cover"
          />
          <h3 className="text-xl font-semibold">{category.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {category.items.length} Items
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
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {category.items.map((item) => (
              <MenuItemCard key={item.name} item={item} />
            ))}
          </div>

          <div className="flex gap-4 text-blue-600 text-sm font-medium">
            <Button>+ Create new item</Button>
            <Button>+ Add existing items</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryCard;
