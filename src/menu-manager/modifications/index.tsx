import React, { useState } from "react";
import Button from "../../components/Button";
import AddIcon from "../../assets/styledIcons/AddIcon";
import { useGetModifiersQuery } from "../../services/menuApi";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import AddModifierModal from "./AddModifierModal";
import ActionIcon from "../../components/ActionIcon";
import EditIcon from "../../assets/styledIcons/EditIcon";
import TrashIcon from "../../assets/styledIcons/TrashIcon";
import { useTheme } from "../../context/themeContext";

const ModifierList: React.FC = () => {
  const { id: menuId = "" } = useParams();
  const { data: modifiers = [], isLoading } = useGetModifiersQuery(menuId);
  const [showModal, setShowModal] = useState(false);
  const [selectedModifierId, setSelectedModifierId] = useState<
    string | undefined
  >(undefined);
    const { isDarkMode } = useTheme();

  if (isLoading) return <Loader />;

  return (
    <div className={`space-y-6 mt-10 ${isDarkMode ? "bg-slate-900" : "bg-white"} p-6 rounded shadow-sm`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Modifications</h2>

        <Button
          onClick={() => {
            setShowModal(true);
            setSelectedModifierId(undefined);
          }}
        >
          <AddIcon />{" "}
          <span className="hidden sm:inline">Create new modification</span>
        </Button>
      </div>

      {modifiers.length === 0 ? (
        <p className="text-gray-500 text-sm">No modifications found</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {modifiers.map((mod) => {
            const itemNames = mod?.items?.map((item) => item.name) || [];
            const firstTwo = itemNames.slice(0, 2).join(", ");
            const moreCount = itemNames.length > 2 ? itemNames.length - 2 : 0;

            return (
              <div
                key={mod.id}
                className={`group relative ${isDarkMode ? "bg-slate-950 border border-slate-800" : "border border-gray-200"}  rounded-xl p-5 ${isDarkMode ? "bg-slate-950" : "bg-white"} shadow-sm hover:shadow-md transition-all duration-200`}
              >
                {/* Edit/Delete Actions */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <ActionIcon
                    icon={<EditIcon size={18}
                    className={isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-gray-500 hover:text-gray-700"}
                    
                    />}
                    onClick={() => {
                      setSelectedModifierId(mod.id);
                      setShowModal(true);
                    }}
                    title="Edit"
                  />
                  <ActionIcon
                    icon={<TrashIcon size={18} 
                    className={isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-gray-500 hover:text-gray-700"}
                    />}
                    onClick={() => console.log("Delete", mod.id)}
                    title="Delete"
                  />
                </div>

                {/* Grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Side */}
                  <div>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-orange-100"} capitalize truncate`}>
                      {mod.name}
                    </h3>
                    {mod.description && (
                        <p className={`text-sm ${isDarkMode ? "text-white" : "text-gray-600"} mt-1 line-clamp-2`}>
                        {mod.description}
                      </p>
                    )}

                    <div className={`mt-3 text-sm ${isDarkMode ? "text-slate-500" : "text-gray-700"} space-y-1`}>
                      <p>
                        <span className="font-medium">Required:</span>{" "}
                        {mod.isRequired ? "Yes" : "No"}
                      </p>
                      <p>
                        <span className="font-medium">Multi-choice:</span>{" "}
                        {mod.isMoreOnce ? "Allowed" : "One-time"}
                      </p>
                      <p>
                        <span className="font-medium">Selections:</span> Min{" "}
                        {mod.minSelection} – Max {mod.maxSelection}
                      </p>
                    </div>
                  </div>

                  {/* Right Side */}
                  {itemNames.length > 0 && (
                    <div className="flex flex-col justify-between">
                      <div className={`text-sm ${isDarkMode ? "text-slate-500" : "text-gray-700"}`}>
                        <p className="font-medium mb-1">Applied to:</p>
                        <p className="text-primary-600 truncate">
                          {firstTwo}
                          {moreCount > 0 && ` +${moreCount} more`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddModifierModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedModifierId(undefined); // reset on close
        }}
        menuId={menuId}
        modifierId={selectedModifierId}
      />
    </div>
  );
};

export default ModifierList;
