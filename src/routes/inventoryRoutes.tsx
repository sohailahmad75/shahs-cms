import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import { ROLES } from "../helper";
import ProductListPage from "../features/products";

const inventoryRoutes = [
  {
    element: <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]} />,
    children: [
      {
        path: "/inventory/products",
        element: (
          <MainLayout>
            <ProductListPage />
          </MainLayout>
        ),
      },
    ],
  },
];

export default inventoryRoutes;
