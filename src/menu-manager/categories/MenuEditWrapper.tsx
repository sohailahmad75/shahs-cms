import { useLocation, useNavigate, useParams } from "react-router-dom";
import { type PropsWithChildren, useState } from "react";
import { useMemo } from "react";
import {
  useAssignMenuToManyStoresMutation,
  useGetMenuByIdQuery,
  useSyncMenuToUberMutation,
} from "../../services/menuApi";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import PublishBanner from "./PublishBanner";

const tabs = [
  { label: "Categories", slug: "categories" },
  { label: "Items", slug: "items" },
  { label: "Modifications", slug: "modifications" },
];

const MenuEditWrapper = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id = "" } = useParams();

  const [syncMenuToUber, { isLoading: isSyncMenuToUberLoading }] =
    useSyncMenuToUberMutation();
  const [selectedSites, setSelectedSites] = useState<string[]>([]);

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

  const activeTab = useMemo(() => {
    return tabs.findIndex((tab) => location.pathname.endsWith(`/${tab.slug}`));
  }, [location.pathname]);

  if (isLoading) return <p>Loading menu...</p>;
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

        <div className="flex justify-end mt-2 gap-2 flex-wrap">
          <Button
            variant="outlined"
            disabled
            loading={isSyncMenuToUberLoading}
            onClick={async () => {
              try {
                const a = syncMenuToUber({ id });
                console.log(a);
                toast.success("Synced with Uber");
              } catch (e) {
                console.log(e);
              }
            }}
          >
            Sync with Uber
          </Button>
          <Button variant="outlined" disabled>
            Sync with Deliveroo
          </Button>
          <Button variant="outlined" disabled>
            Sync with JustEat
          </Button>
        </div>
      </div>

      <div className="py-7 min-h-screen">
        <div className="flex gap-6 border-b pb-2 mb-6 border-gray-100">
          {tabs.map((tab, i) => (
            <div
              key={tab.slug}
              onClick={() => navigate(`/menus/${id}/${tab.slug}`)}
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
