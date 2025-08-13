import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import { ROLES } from "../helper";
import DocumentTypeListPage from "../features/documentType";

const documentRoutes = [
  {
    element: <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]} />,
    children: [
      {
        path: "/setting/document-type",
        element: (
          <MainLayout>
            <DocumentTypeListPage />
          </MainLayout>
        ),
      },
    ],
  },
];

export default documentRoutes;