import { Outlet } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import { ROLES } from "../helper";

import DocumentTypeListPage from "../features/documentType";
import AccountManagement from "../features/profileSettings";

const documentRoutes = [
  {
    element: <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]} />,
    children: [
      {
        path: "/setting",
        element: (
          <MainLayout>
            <Outlet />
          </MainLayout>
        ),
        children: [
          { path: "document-type", element: <DocumentTypeListPage /> },
          { path: "profile-settings", element: <AccountManagement /> },
        ],
      },
    ],
  },
];

export default documentRoutes;
