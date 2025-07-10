import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { useGetStoresQuery } from "../../features/stores/services/storeApi";
import CheckboxField from "../../components/CheckboxField";
import UploadIcon from "../../assets/styledIcons/UploadIcon";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import React from "react";

interface PublishSitesModalProps {
  isOpen: boolean;
  selectedSites?: string[];
  onClose: () => void;
  onSave?: (selectedIds: string[]) => void;
  setSelectedSites: React.Dispatch<React.SetStateAction<string[]>>;
}

const PublishSitesModal = ({
  isOpen,
  selectedSites = [],
  onClose,
  onSave,
  setSelectedSites,
}: PublishSitesModalProps) => {
  const { data: stores = [], isLoading } = useGetStoresQuery();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sites">
      <div className="mb-8">
        <div className="col-span-2 flex items-center gap-6 mb-6">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="text-orange-100 text-md font-medium whitespace-nowrap">
            Current sites
          </span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>

        <div className="text-center italic text-slate-500 dark:text-slate-400">
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-md p-4 mx-auto text-center">
            <p className="font-semibold text-slate-600 mb-2">
              No sites currently using this menu
            </p>
          </div>
        </div>
      </div>

      <div className="col-span-2 flex items-center gap-6 mb-6">
        <div className="flex-grow h-px bg-gray-200" />
        <span className="text-orange-100 text-md font-medium whitespace-nowrap">
          Sites using other menus
        </span>
        <div className="flex-grow h-px bg-gray-200" />
      </div>

      {isLoading ? (
        <Loader />
      ) : stores.length < 1 ? (
        <div className="text-center italic text-slate-500 dark:text-slate-400">
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-md p-4 mx-auto text-center">
            <p className="font-semibold text-slate-600 mb-2">
              No stores found.
            </p>

            <p className="text-sm text-gray-500">
              You can{" "}
              <Link
                to="/stores"
                className="text-orange-100 font-medium underline hover:text-primary-100"
              >
                create a store
              </Link>{" "}
              and assign this menu to it.
            </p>
          </div>
        </div>
      ) : (
        <div className="max-h-70 overflow-auto space-y-3">
          {stores.map((store) => (
            <div
              key={store.id}
              className="pb-3 border-b border-gray-200 last:border-none"
            >
              <div className="mb-2 text-sm font-medium text-gray-700">
                {store.companyName}
              </div>
              <CheckboxField
                name={store.id}
                label={`${store.name}`}
                checked={selectedSites.includes(store.id)}
                onChange={() =>
                  setSelectedSites((prev) => {
                    console.log(prev);
                    return prev.includes(store.id)
                      ? prev.filter((id) => id !== store.id)
                      : [...prev, store.id];
                  })
                }
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-end gap-2">
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (onSave) onSave(selectedSites);
          }}
        >
          <UploadIcon />
          Publish – {selectedSites.length} site
          {selectedSites.length !== 1 && "s"}
        </Button>
      </div>
    </Modal>
  );
};

export default PublishSitesModal;
