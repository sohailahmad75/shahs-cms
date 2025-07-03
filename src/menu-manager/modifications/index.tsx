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

const ModifierList: React.FC = () => {
  const { id: menuId = "" } = useParams();
  const { data: modifiers = [], isLoading } = useGetModifiersQuery(menuId);
  const [showModal, setShowModal] = useState(false);
  const [selectedModifierId, setSelectedModifierId] = useState<
    string | undefined
  >(undefined);
  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6 mt-10 bg-white p-6 rounded shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Modifications</h2>
        <Button onClick={() => setShowModal(true)}>
          <AddIcon /> Create new modification
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
                className="group relative border border-gray-200 rounded p-4 bg-white shadow-sm transition duration-200 hover:shadow-md"
              >
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ActionIcon
                    icon={<EditIcon />}
                    onClick={() => {
                      setSelectedModifierId(mod.id);
                      setShowModal(true);
                    }}
                    title="Edit"
                  />
                  <ActionIcon
                    icon={<TrashIcon />}
                    onClick={() => console.log("Delete", mod.id)}
                    title="Delete"
                  />
                </div>
                <h3 className="text-lg font-medium text-secondary-100 truncate capitalize">
                  {mod.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {mod.description}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {mod.isRequired ? "Required" : "Optional"} &nbsp;|&nbsp; Min:{" "}
                  {mod.minSelection} &nbsp;|&nbsp; Max: {mod.maxSelection}
                </p>
                <p className="text-sm text-gray-500">
                  {mod.isMoreOnce
                    ? "Can choose more than once"
                    : "Choose only once"}
                </p>

                {itemNames.length > 0 && (
                  <div className="mt-3 text-sm">
                    <span className="font-medium text-gray-700">
                      Items applied to:&nbsp;
                    </span>
                    <span className="text-primary-100 capitalize">
                      {firstTwo}
                      {moreCount > 0 && ` +${moreCount} more`}
                    </span>
                  </div>
                )}
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
