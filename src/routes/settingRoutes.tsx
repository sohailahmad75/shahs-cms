import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import { ROLES } from "../helper";
import SettingsPage from "../features/storeSettings/component/settingPage";

const settingRoutes = [
  {
    element: <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]} />,
    children: [
      {
        path: "/setting",
        element: (
          <MainLayout>
            <SettingsPage />
          </MainLayout>
        ),
      },
    ],
  },
];

export default settingRoutes;