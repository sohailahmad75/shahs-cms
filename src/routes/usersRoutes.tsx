import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import { ROLES } from "../helper";
import UsersTypeListPage from "../features/users";
import UsersLayout from "../features/users/components/UsersLayout";
import UsersInformation from "../features/users/components/UsersInformation";
import UserDocuments from "../features/users/components/UsersDocuments";


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
      {
        path: "/users/:id",
        element: (
          <MainLayout>
            <UsersLayout />
          </MainLayout>
        ),
        children: [
          {
            path: "documents", 
            element: <UserDocuments/>,
          },
          {
            index: true,
            element: <UsersInformation />,
          },
        ],
      },
    ],
  },
];

export default usersRoutes;