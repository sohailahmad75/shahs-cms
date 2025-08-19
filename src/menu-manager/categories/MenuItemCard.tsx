import React from "react";
import { useTheme } from "../../context/themeContext";
import type { MenuItem } from "../menu.types";
import ActionIcon from "../../components/ActionIcon";
import EditIcon from "../../assets/styledIcons/EditIcon";
import TrashIcon from "../../assets/styledIcons/TrashIcon";
import { toast } from "react-toastify";
import ConfirmDelete from "../../components/ConfirmDelete";

type Props = {
  item: MenuItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  className?: string;
};

const MenuItemCard: React.FC<Props> = ({
  item,
  onEdit,
  onDelete,
  className,
}) => {
  const { isDarkMode } = useTheme();
  const containerBase = "relative group rounded p-2 flex gap-3 items-start";
  const themeBorder = isDarkMode
    ? "bg-slate-950 border border-slate-800"
    : "bg-white border border-gray-200";

  return (
    <div className={`${containerBase} ${themeBorder} ${className ?? ""}`}>
      {/* Top-right actions */}
      <div
        className="
          absolute top-2 right-2 flex gap-1
          opacity-100 md:opacity-0 md:group-hover:opacity-100
          focus-within:opacity-100 transition-opacity
        "
      >
        <ActionIcon
          icon={<EditIcon size={18} />}
          aria-label={`Edit ${item.name}`}
          onClick={() => onEdit(item.id)}
        />

        <ConfirmDelete
          onConfirm={async () => onDelete(item.id)}
          renderTrigger={({ open }) => (
            <ActionIcon
              className="text-red-500"
              icon={<TrashIcon size={18} />}
              onClick={open}
              title="Delete"
            />
          )}
        />
      </div>

      {/* Image */}
      {item.signedUrl ? (
        <img
          src={item.signedUrl}
          alt={item.name}
          className="w-[64px] h-[64px] object-cover rounded flex-shrink-0"
        />
      ) : (
        <div className="w-[64px] h-[64px] rounded bg-gray-100 flex-shrink-0" />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-md truncate">{item.name}</p>
        {item.description && (
          <p className="text-sm text-gray-500 line-clamp-2">
            {item.description}
          </p>
        )}
        <p className="text-sm text-gray-700 font-semibold">
          £{Number(item.price).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default MenuItemCard;
