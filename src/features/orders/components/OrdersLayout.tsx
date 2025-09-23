import { useParams } from "react-router-dom";
import TabbedPageLayout from "../../../components/TabbedPageLayout";
import { useGetOrderByIdQuery } from "../services/orderApi";
import Loader from "../../../components/Loader";
import { Outlet } from "react-router-dom";
import { useMemo } from "react";

const OrdersLayout = () => {
    const { id } = useParams();
    const { data: Order, isLoading } = useGetOrderByIdQuery(id!);

    const tabs = useMemo(
        () => [
            { label: "Order Information", path: `/orders/${id}` },
        ],
        [id]
    );

    if (isLoading) return <Loader />;
    if (!Order) return <div className="text-red-500 p-4">Order not found.</div>;

    return (
        <TabbedPageLayout title={`Order #${Order.orderNumber || id}`} tabs={tabs}>
            <Outlet />
        </TabbedPageLayout>
    );

};

export default OrdersLayout;
