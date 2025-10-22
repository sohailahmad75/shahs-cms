import { useParams } from "react-router-dom";
import TabbedPageLayout from "../../../../components/TabbedPageLayout";
import { useGetOneSupplierQuery } from "../services/SupplierApi";
import Loader from "../../../../components/Loader";
import { Outlet } from "react-router-dom";
import { useMemo } from "react";

const SupplierLayout = () => {
    const { id } = useParams();
    const { data: supplier, isLoading } = useGetOneSupplierQuery(id!);

    const tabs = useMemo(
        () => [
            { label: "Supplier Information", path: `/sales/suppliers/${id}` },
        ],
        [id]
    );

    if (isLoading) return <Loader />;
    if (!supplier) return <div className="text-red-500 p-4">Supplier not found.</div>;

    return (
        <TabbedPageLayout title={`${supplier.name}`} tabs={tabs}>
            <Outlet />
        </TabbedPageLayout>
    );

};

export default SupplierLayout;
