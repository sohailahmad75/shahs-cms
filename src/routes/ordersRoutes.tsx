import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import { ROLES } from "../helper";
import OrderListPage from "../features/orders";
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
    ],
  },
];

export default ordersRoutes;
