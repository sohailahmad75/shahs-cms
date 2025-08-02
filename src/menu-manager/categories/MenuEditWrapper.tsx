import { useLocation, useNavigate, useParams } from "react-router-dom";
import { type PropsWithChildren, useEffect, useState } from "react";
import { useMemo } from "react";
import {
  useAssignMenuToManyStoresMutation,
  useGetMenuByIdQuery,
  useSyncMenuToUberMutation,
} from "../../services/menuApi";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import PublishBanner from "./PublishBanner";
import Loader from "../../components/Loader";

const tabs = [
  { label: "Categories", slug: "categories" },
  { label: "Items", slug: "items" },
  { label: "Modifications", slug: "modifications" },
  { label: "Connected Stores", slug: "connected" },
];

interface SyncButtonsProps {
  menuId: string;
  hasConnectedStores: boolean;
  isSyncing: boolean;
}

const SyncButtons = ({ 
  menuId,
  hasConnectedStores,
  isSyncing 
}: SyncButtonsProps) => {
  const [syncMenuToUber] = useSyncMenuToUberMutation();

  return (
    <div className="flex justify-end mt-2 gap-2 flex-wrap">
      <Button
        variant="outlined"
        disabled={!hasConnectedStores}
        loading={isSyncing}
        onClick={async () => {
          try {
            await syncMenuToUber({ id: menuId }).unwrap();
            toast.success("Synced with Uber");
          } catch (e) {
            console.log(e);
            toast.error("Failed to sync with Uber");
          }
        }}
      >
        Sync with Uber
      </Button>
      <Button 
        variant="outlined" 
        disabled={!hasConnectedStores}
      >
        Sync with Deliveroo
      </Button>
      <Button 
        variant="outlined" 
        disabled={!hasConnectedStores}
      >
        Sync with JustEat
      </Button>
    </div>
  );
};

const MenuEditWrapper = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id = "" } = useParams();

  const [syncMenuToUber, { isLoading: isSyncMenuToUberLoading }] =
    useSyncMenuToUberMutation();
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showStoresDropdown, setShowStoresDropdown] = useState(false);

  const [assignMenuToManyStores, { isLoading: isAssigning }] =
    useAssignMenuToManyStoresMutation();

  const handlePublish = async () => {
    if (!id || selectedSites.length === 0) return;

    try {
      await assignMenuToManyStores({
        menuId: id,
        storeIds: selectedSites,
      }).unwrap();
      toast.success("Menu successfully assigned to selected stores!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to assign menu to selected stores.");
    }
  };

  const { data: menu, isLoading } = useGetMenuByIdQuery(id);

  useEffect(() => {
    if (!menu) return;
    setSelectedSites([...menu.storeMenus.map((sm) => sm.storeId)]);
  }, [menu]);

  const activeTab = useMemo(() => {
    return tabs.findIndex((tab) => location.pathname.endsWith(`/${tab.slug}`));
  }, [location.pathname]);

  const hasConnectedStores = useMemo(() => {
    return menu?.storeMenus ? menu.storeMenus.length > 0 : false;
  }, [menu]);

  const filteredStores = useMemo(() => {
    if (!menu?.storeMenus) return [];
    return menu.storeMenus.filter(storeMenu => 
      storeMenu.store?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      storeMenu.storeId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [menu?.storeMenus, searchTerm]);

  const handleTabClick = (tabSlug: string) => {
    if (tabSlug === "connected") {
      setShowStoresDropdown(!showStoresDropdown);
    } else {
      setShowStoresDropdown(false);
      navigate(`/menus/${id}/${tabSlug}`);
    }
  };

  if (isLoading) return <Loader />;
  if (!menu) return <p>Menu not found</p>;

  return (
    <div className="p-2">
      <div className="flex flex-col gap-4">
        {/* Top: Image and Info */}
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <img
            src={menu.image}
            alt="menu header"
            className="w-full max-w-[280px] h-auto object-contain rounded-md"
          />

          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-800">{menu.name}</h1>
            <p className="text-sm text-gray-600 mt-1">{menu.description}</p>
          </div>
        </div>

        <SyncButtons 
          menuId={id} 
          hasConnectedStores={hasConnectedStores} 
          isSyncing={isSyncMenuToUberLoading} 
        />
      </div>

      <div className="py-7 min-h-screen">
        <div className="flex gap-6 border-b pb-2 mb-6 border-gray-100 relative">
          {tabs.map((tab, i) => (
            <div
              key={tab.slug}
              onClick={() => handleTabClick(tab.slug)}
              className={`relative cursor-pointer pb-1 transition-all duration-100 ease-in-out font-semibold
                ${
                  i === activeTab
                    ? "text-primary-100 after:scale-x-100"
                    : "text-gray-500 hover:text-primary-100 font-normal after:scale-x-0"
                }
                after:content-[''] after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-full after:bg-primary-100 after:transition-transform after:duration-100 after:origin-left
              `}
            >
              {tab.label}
              {tab.slug === "connected" && showStoresDropdown && (
                <div className="absolute left-0 mt-2 w-72 bg-white shadow-lg rounded-md z-10 border border-gray-200">
                  <div className="max-h-60 overflow-y-auto">
                    {filteredStores.length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {filteredStores.map((storeMenu) => (
                          <li 
                            key={storeMenu.storeId} 
                            className="p-3 hover:bg-gray-50 transition-colors duration-150"
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center min-w-0">
                                <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                                  {storeMenu.store?.name?.charAt(0) || 'S'}
                                </div>
                                <div className="truncate">
                                  <p className="text-sm font-medium text-gray-700 truncate">
                                    {storeMenu.store?.name || `Store ${storeMenu.storeId}`}
                                  </p>
                                  <p className="text-xs text-gray-400 truncate">
                                    ID: {storeMenu.storeId}
                                  </p>
                                </div>
                              </div>
                              {storeMenu.isPublished && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  Published
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <svg 
                          className="mx-auto h-8 w-8 text-gray-400" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mt-2 text-sm">No stores found</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-3">{children}</div>
      </div>
      <PublishBanner
        isAssigning={isAssigning}
        selectedSites={selectedSites}
        setSelectedSites={setSelectedSites}
        onPublish={handlePublish}
        storeMenus={menu.storeMenus}
      />
    </div>
  );
};

export default MenuEditWrapper;