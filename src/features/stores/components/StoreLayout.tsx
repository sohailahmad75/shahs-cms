import { useParams } from "react-router-dom";
import TabbedPageLayout from "../../../components/TabbedPageLayout";
import { useGetStoreByIdQuery } from "../services/storeApi";
import Loader from "../../../components/Loader";
import { Outlet } from "react-router-dom";
import { useMemo } from "react";

const StoreLayout = () => {
  const { id } = useParams();
  const { data: store, isLoading } = useGetStoreByIdQuery(id!);
  const tabs = useMemo(
    () => [
      { label: "Store Information", path: `/stores/${id}` },
      { label: "Store Documents", path: `/stores/${id}/documents` },
    ],
    [id],
  );

  if (isLoading) return <Loader />;
  if (!store) return <div className="text-red-500 p-4">Store not found.</div>;

  return (
    <TabbedPageLayout title={store.name} tabs={tabs}>
      <Outlet />
    </TabbedPageLayout>
  );
};

export default StoreLayout;
