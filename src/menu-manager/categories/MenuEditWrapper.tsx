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
import { useTheme } from "../../context/themeContext";
import UberEatsLogo from "../../assets/styledIcons/UberEatsLogo";
import BrandButton from "../components/BrandButton";

const tabs = [
  { label: "Categories", slug: "categories" },
  { label: "Items", slug: "items" },
  { label: "Modifications", slug: "modifications" },
];

interface SyncButtonsProps {
  menuId: string;
  hasConnectedStores: boolean;
  selectedStores: string[];
}

const SyncButtons = ({
  menuId,
  hasConnectedStores,
  selectedStores,
}: SyncButtonsProps) => {
  const [syncMenuToUber, { isLoading: isSyncMenuToUberLoading }] =
    useSyncMenuToUberMutation();

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
      <BrandButton
        brand={"uber"}
        variant={"outlined"}
        disabled={!hasConnectedStores || isSyncMenuToUberLoading}
        loading={isSyncMenuToUberLoading}
        onClick={handleSync}
      >
        Sync with Uber
      </BrandButton>
      <BrandButton brand={"deliveroo"} variant={"outlined"} disabled>
        Sync with deliveroo
      </BrandButton>
      <BrandButton brand={"justeat"} variant={"outlined"} disabled>
        Sync with Just Eat
      </BrandButton>
    </div>
  );
};

const MenuEditWrapper = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const { isDarkMode } = useTheme();

  const [selectedSites, setSelectedSites] = useState<string[]>([]);

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
          <div className="w-full max-w-[280px] max-h-[160px] rounded-md overflow-hidden flex items-center justify-center bg-gray-100">
            <img
              src={menu.signedUrl}
              alt="menu header"
              className="object-contain max-w-full max-h-full"
            />
          </div>

          <div className="flex-1">
            <h1
              className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}
            >
              {menu.name}
            </h1>
            <p className="text-sm text-gray-600 mt-1">{menu.description}</p>
          </div>
        </div>

        <SyncButtons
          menuId={id}
          hasConnectedStores={hasConnectedStores}
          selectedStores={selectedSites}
        />
      </div>

      {/* Tab Navigation */}
      <div className="py-7 min-h-screen">
        <div
          className={`flex gap-6 border-b pb-2 mb-6  ${isDarkMode ? "bg-slate-950 border border-slate-950" : "border-gray-100"} relative`}
        >
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
