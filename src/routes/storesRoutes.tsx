import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import { ROLES } from "../helper";
import StoreListPage from "../features/stores";

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
    ],
  },
];

export default storeRoutes;
