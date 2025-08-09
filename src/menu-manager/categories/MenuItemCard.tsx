import React from "react";
import { useTheme } from "../../context/themeContext";

const MenuItemCard: React.FC<{ item: MenuItem }> = ({ item }) => {
  const { isDarkMode } = useTheme();
  return (
    <div className={`${isDarkMode ? "bg-slate-950 border border-slate-800" : "border border-gray-200"} rounded p-2 flex gap-3 items-start`}>
      <img
        src={item.image}
        alt={item.name}
        className="w-[64px] h-[64px] object-cover rounded flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-md truncate">{item.name}</p>
        <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
        <p className="text-sm text-gray-500 font-semibold">{item.price}</p>
      </div>
    </div>
  );
};

export default MenuItemCard;
