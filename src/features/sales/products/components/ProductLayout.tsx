import { useParams } from "react-router-dom";
import TabbedPageLayout from "../../../../components/TabbedPageLayout";
import { useGetOneProductQuery } from "../services/productApi";
import Loader from "../../../../components/Loader";
import { Outlet } from "react-router-dom";
import { useMemo } from "react";

const ProductLayout = () => {
    const { id } = useParams();
    const { data: product, isLoading } = useGetOneProductQuery(id!);

    const tabs = useMemo(
        () => [
            { label: "Product Information", path: `/sales/products/${id}` },
        ],
        [id]
    );

    if (isLoading) return <Loader />;
    if (!product) return <div className="text-red-500 p-4">Product not found.</div>;

    return (
        <TabbedPageLayout 
            title={`${product.name} (${product.itemCode})`} 
            tabs={tabs}
        >
            <Outlet />
        </TabbedPageLayout>
    );
};

export default ProductLayout;