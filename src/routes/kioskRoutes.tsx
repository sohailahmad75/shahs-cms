import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import { ROLES } from "../helper";
import KiosksListPage from "../features/kiosks";

const kioskRoutes = [
  {
    element: <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]} />,
    children: [
      {
        path: "/kiosks",
        element: (
          <MainLayout>
            <KiosksListPage />
          </MainLayout>
        ),
      },
    ],
  },
];

export default kioskRoutes;
