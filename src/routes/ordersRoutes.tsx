import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import { ROLES } from "../helper";
import OrderListPage from "../features/orders";
import OrderInformation from "../features/orders/components/OrdersInformation";
import OrdersLayout from "../features/orders/components/OrdersLayout";
const ordersRoutes = [
    {
        element: <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]} />,
        children: [
            {
                path: "/orders",
                element: (
                    <MainLayout>
                        <OrderListPage />
                    </MainLayout>
                ),
            },
            {
                path: "/orders/:id",
                element: (
                    <MainLayout>
                        <OrdersLayout/>
                    </MainLayout>
                ),
                children: [
                    {
                        index: true,
                        element: <OrderInformation />,
                    },
                ],
            },
        ],
    },
];

export default ordersRoutes;
