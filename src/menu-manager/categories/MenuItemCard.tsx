import React from "react";
import type { MenuItem } from "../helper/menu-types";

const MenuItemCard: React.FC<{ item: MenuItem }> = ({ item }) => {
  return (
    <div className="border border-gray-200 rounded p-2 flex gap-3 items-start">
      <div className="w-[82px] h-[55px] flex-shrink-0 rounded overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
        <img
          src={item.signedUrl}
          alt={item.name}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-md truncate">{item.name}</p>
        <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
        <p className="text-sm text-gray-500 font-semibold">{item.price}</p>
      </div>
    </div>
  );
};

export default MenuItemCard;
