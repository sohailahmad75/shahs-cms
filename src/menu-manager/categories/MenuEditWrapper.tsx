import { useLocation, useNavigate, useParams } from "react-router-dom";
import { type PropsWithChildren, useEffect, useMemo, useState } from "react";
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
  selectedStores: string[];
}

const SyncButtons = ({
  menuId,
  hasConnectedStores,
  isSyncing,
  selectedStores,
}: SyncButtonsProps) => {
  const [syncMenuToUber] = useSyncMenuToUberMutation();

  const handleSync = async () => {
    try {
      await syncMenuToUber({
        id: menuId,
        storeIds: selectedStores,
      }).unwrap();
      toast.success("Synced with Uber");
    } catch (e) {
      console.error(e);
      toast.error("Failed to sync with Uber");
    }
  };

  return (
    <div className="flex justify-end mt-2 gap-2 flex-wrap">
      <Button
        variant="outlined"
        disabled={!hasConnectedStores}
        loading={isSyncing}
        onClick={handleSync}
      >
        Sync with Uber
      </Button>
      <Button variant="outlined" disabled={!hasConnectedStores}>
        Sync with Deliveroo
      </Button>
      <Button variant="outlined" disabled={!hasConnectedStores}>
        Sync with JustEat
      </Button>
    </div>
  );
};

const MenuEditWrapper = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id = "" } = useParams();

  const [selectedSites, setSelectedSites] = useState<string[]>([]);

  const [syncMenuToUber, { isLoading: isSyncMenuToUberLoading }] =
    useSyncMenuToUberMutation();

  const [assignMenuToManyStores, { isLoading: isAssigning }] =
    useAssignMenuToManyStoresMutation();

  const { data: menu, isLoading } = useGetMenuByIdQuery(id);

  const storeMenus = menu?.storeMenus ?? [];

  useEffect(() => {
    const storeIds = storeMenus.map((sm) => sm.storeId);
    setSelectedSites(storeIds);
  }, [menu]);

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

  const activeTab = useMemo(() => {
    return tabs.findIndex((tab) => location.pathname.endsWith(`/${tab.slug}`));
  }, [location.pathname]);

  const hasConnectedStores = storeMenus.length > 0;

  const handleTabClick = (tabSlug: string) => {
    navigate(`/menus/${id}/${tabSlug}`);
  };

  if (isLoading) return <Loader />;
  if (!menu) return <p>Menu not found</p>;

  return (
    <div className="p-2">
      <div className="flex flex-col gap-4">
        {/* Top Info */}
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
          selectedStores={selectedSites}
        />
      </div>

      {/* Tab Navigation */}
      <div className="py-7 min-h-screen">
        <div className="flex gap-6 border-b pb-2 mb-6 border-gray-100 relative">
          {tabs.map((tab, i) => (
            <div
              key={tab.slug}
              onClick={() => handleTabClick(tab.slug)}
              className={`relative cursor-pointer pb-1 transition-all duration-100 ease-in-out font-semibold
                ${i === activeTab
                  ? "text-primary-100 after:scale-x-100"
                  : "text-gray-500 hover:text-primary-100 font-normal after:scale-x-0"
                }
                after:content-[''] after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-full after:bg-primary-100 after:transition-transform after:duration-100 after:origin-left
              `}
            >
              {tab.label}
            </div>
          ))}
        </div>

        <div className="p-3">{children}</div>
      </div>

      {/* Publish Banner */}
      <PublishBanner
        isAssigning={isAssigning}
        selectedSites={selectedSites}
        setSelectedSites={setSelectedSites}
        onPublish={handlePublish}
        storeMenus={storeMenus}
      />
    </div>
  );
};

export default MenuEditWrapper;
