import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import { ROLES } from "../helper";
import UsersTypeListPage from "../features/users";

const usersRoutes = [
  {
    element: <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]} />,
    children: [
      {
        path: "/users",
        element: (
          <MainLayout>
            <UsersTypeListPage />
          </MainLayout>
        ),
      },
    ],
  },
];

export default usersRoutes;