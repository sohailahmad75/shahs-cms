import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import { ROLES } from "../helper";
import Invoice from "../features/invoice";

const invoiceRoutes = [
  {
    element: <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]} />,
    children: [
      {
        path: "/invoices",
        element: (
          <MainLayout>
            <Invoice />
          </MainLayout>
        ),
      },
    ],
  },
];

export default invoiceRoutes;
