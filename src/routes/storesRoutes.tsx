import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import { ROLES } from "../helper";
import StoreListPage from "../features/stores";
import StoreLayout from "../features/stores/components/StoreLayout";
import StoreInformation from "../features/stores/components/StoreInformation";
import StoreDocuments from "../features/stores/components/StoreDocuments";

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
            <StoreLayout />
          </MainLayout>
        ),
        children: [
          {
            path: "documents", // /stores/:id/documents
            element: <StoreDocuments />,
          },
          {
            index: true, // default: /stores/:id
            element: <StoreInformation />,
          },
        ],
      },
    ],
  },
];

export default storeRoutes;
