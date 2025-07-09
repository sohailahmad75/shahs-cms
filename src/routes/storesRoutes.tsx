import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import { ROLES } from "../helper";
import StoreListPage from "../features/stores";
import StoreDetailPage from "../features/stores/components/StoreDetailPage";

const storeRoutes = [
  {
    element: <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]} />,
    children: [
      {
        path: "/stores",
        element: (
          <MainLayout>
            <StoreListPage />
          </MainLayout>
        ),
      },
      {
        path: "/stores/:id",
        element: (
          <MainLayout>
            <StoreDetailPage />
          </MainLayout>
        ),
      },
    ],
  },
];

export default storeRoutes;
