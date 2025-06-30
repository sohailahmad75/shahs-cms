import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../features/dashboard";
import { ROLES } from "../helper";

const dashboardRoutes = [
  {
    element: (
      <ProtectedRoute
        allowedRoles={[
          ROLES.SUPER_ADMIN,
          ROLES.ADMIN,
          ROLES.STORE_MANAGER,
          ROLES.STAFF,
        ]}
      />
    ),
    children: [
      {
        path: "/dashboard",
        element: (
          <MainLayout>
            <Dashboard />
          </MainLayout>
        ),
      },
    ],
  },
];

export default dashboardRoutes;
