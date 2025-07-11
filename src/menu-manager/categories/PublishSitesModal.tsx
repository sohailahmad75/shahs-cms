import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { useGetStoresQuery } from "../../features/stores/services/storeApi";
import CheckboxField from "../../components/CheckboxField";
import UploadIcon from "../../assets/styledIcons/UploadIcon";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import type { StoreMenu } from "../index";
import ArrowIcon from "../../assets/styledIcons/ArrowIcon";

interface PublishSitesModalProps {
  isOpen: boolean;
  selectedSites?: string[];
  onClose: () => void;
  onSave?: (selectedIds: string[]) => void;
  setSelectedSites: React.Dispatch<React.SetStateAction<string[]>>;
  storeMenus?: StoreMenu[];
}

const PublishSitesModal = ({
  isOpen,
  selectedSites = [],
  onClose,
  onSave,
  setSelectedSites,
  storeMenus,
}: PublishSitesModalProps) => {
  const { data: stores = [], isLoading } = useGetStoresQuery();
  console.log(storeMenus);
  const remainingStores = stores.filter(
    (store) => !storeMenus?.some((sm) => sm.storeId === store.id),
  );

  const allSitesUsingThisMenu = remainingStores.length === 0;
  const [open, setOpen] = useState(true);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sites">
      <div className="mb-8">
        <div className="col-span-2 flex items-center gap-2 mb-4">
          <div className="flex-grow h-px bg-gray-200" />

          <span className="text-orange-100 text-md font-medium whitespace-nowrap">
            Current sites{" "}
            {storeMenus?.length === 0 ? "" : `(${storeMenus?.length})`}
          </span>

          <div className="flex-grow h-px bg-gray-200" />

          <button
            onClick={() => setOpen((prev) => !prev)}
            className="ml-2 text-orange-100 hover:text-orange-500 transition duration-200 ease-in-out hover:scale-110 cursor-pointer"
            aria-label="Toggle current sites list"
          >
            <ArrowIcon size={20} className={`rotate-${open ? 0 : 180}`} />
          </button>
        </div>

        {open && (
          <div className="pl-4 transition-all duration-300 ease-in-out">
            {storeMenus?.length === 0 ? (
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-md p-4 text-center">
                <p className="font-semibold text-slate-600 dark:text-slate-400">
                  No sites currently using this menu
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {storeMenus?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                  >
                    <div
                      className="flex items-center justify-center
                     gap-2"
                    >
                      <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                        {item.store.name}
                      </span>
                      <span>-</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {item.store.companyName}
                      </span>
                    </div>

                    <div className="text-slate-400 dark:text-slate-500 text-xs italic">
                      Active
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="col-span-2 flex items-center gap-6 mb-4">
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
                className="text-orange-100 font-medium  hover:text-primary-100"
              >
                create a store
              </Link>{" "}
              and assign this menu to it.
            </p>
          </div>
        </div>
      ) : (
        <div className="max-h-70 overflow-auto space-y-3">
          {allSitesUsingThisMenu ? (
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-md p-4 text-center">
              <p className="font-semibold text-slate-600 dark:text-slate-400 mb-2">
                All sites are already using this menu.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You can{" "}
                <Link
                  to="/stores"
                  className="text-orange-100 font-medium  hover:text-primary-100"
                >
                  create a new store
                </Link>{" "}
                and assign this menu to them.
              </p>
            </div>
          ) : (
            remainingStores.map((store) => (
              <div
                key={store.id}
                className="pb-3 border-b border-gray-200 last:border-none"
              >
                <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  {store.companyName}
                </div>
                <CheckboxField
                  name={store.id}
                  label={`${store.name}`}
                  checked={selectedSites.includes(store.id)}
                  onChange={() =>
                    setSelectedSites((prev) =>
                      prev.includes(store.id)
                        ? prev.filter((id) => id !== store.id)
                        : [...prev, store.id],
                    )
                  }
                />
              </div>
            ))
          )}
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
          Save changes
        </Button>
      </div>
    </Modal>
  );
};

export default PublishSitesModal;
