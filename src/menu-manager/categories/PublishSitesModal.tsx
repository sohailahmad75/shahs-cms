import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { useGetStoresQuery } from "../../features/stores/services/storeApi";
import CheckboxField from "../../components/CheckboxField";
import UploadIcon from "../../assets/styledIcons/UploadIcon";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import type { StoreMenu } from "../index";
import ArrowIcon from "../../assets/styledIcons/ArrowIcon";
import InputField from "../../components/InputField";

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
  const [search, setSearch] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search so we don't spam the API
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const {
    data: storesResp = {
      data: [],
      meta: { total: 0, page: 1, perPage: 10, totalPages: 1 },
    },
    isLoading,
    isFetching,
    refetch,
  } = useGetStoresQuery({ perPage: 10, page: 1, query: debouncedQuery });

  const remainingStores = storesResp.data.filter(
    (store) => !storeMenus?.some((sm) => sm.storeId === store.id),
  );

  const allSitesUsingThisMenu = remainingStores.length === 0;
  const [open, setOpen] = useState(true);

  const totalStores = storesResp.meta.total ?? 0;
  const currentCount = storeMenus?.length ?? 0;
  const availableCount = remainingStores.length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sites">
      {/* Current sites */}
      <div className="mb-8">
        <div className="col-span-2 flex items-center gap-2 mb-4">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="text-orange-100 text-md font-medium whitespace-nowrap">
            Current sites {currentCount ? `(${currentCount})` : ""}
          </span>
          <div className="flex-grow h-px bg-gray-200" />
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="ml-2 text-orange-100 hover:text-orange-500 transition duration-200 ease-in-out hover:scale-110 cursor-pointer"
            aria-label="Toggle current sites list"
          >
            <ArrowIcon
              size={20}
              className={`transition-transform ${open ? "" : "rotate-180"}`}
            />
          </button>
        </div>

        {open && (
          <div className="pl-4 transition-all duration-300 ease-in-out">
            {currentCount === 0 ? (
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
                    <div className="flex items-center justify-center gap-2">
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

      {/* Header for "other menus" + results count */}
      <div className="col-span-2 flex items-center gap-6 mb-4">
        <div className="flex-grow h-px bg-gray-200" />
        <span className="text-orange-100 text-md font-medium whitespace-nowrap">
          Sites using other menus {availableCount ? `(${availableCount})` : ""}
        </span>
        <div className="flex-grow h-px bg-gray-200" />
      </div>

      {/* Search + Total (one row, wraps on small) */}
      <div className="mb-4">
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex-1 min-w-[220px]">
            <InputField
              className="w-full"
              name="siteSearch"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sites…"
            />
          </div>

          <span className="text-sm text-gray-600 whitespace-nowrap">
            Total stores: <strong>{totalStores}</strong>
          </span>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <Loader />
      ) : storesResp.data.length < 1 ? (
        debouncedQuery ? (
          // 🔎 Empty state when a search filter is applied
          <div className="text-center italic text-slate-500 dark:text-slate-400">
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-md p-4 mx-auto text-center justify-center items-center flex flex-col">
              <p className="font-semibold text-slate-600 mb-2">
                No stores match your search.
              </p>
              <p className="text-sm text-gray-500 mb-3">
                A search filter is applied. Clear it to see all stores.
              </p>
              <Button variant="outlined" onClick={() => setSearch("")}>
                Clear filter
              </Button>
            </div>
          </div>
        ) : (
          // 🆕 Default empty state (no filter)
          <div className="text-center italic text-slate-500 dark:text-slate-400">
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-md p-4 mx-auto text-center">
              <p className="font-semibold text-slate-600 mb-2">
                No stores found.
              </p>
              <p className="text-sm text-gray-500">
                You can{" "}
                <Link
                  to="/stores"
                  className="text-orange-100 font-medium hover:text-primary-100"
                >
                  create a store
                </Link>{" "}
                and assign this menu to it.
              </p>
            </div>
          </div>
        )
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
                  className="text-orange-100 font-medium hover:text-primary-100"
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
                <div className="mb-1 text-xs font-medium text-gray-700 dark:text-gray-200">
                  {store.companyName}
                </div>
                <CheckboxField
                  labelClassName={"text-xs"}
                  size={"4"}
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
