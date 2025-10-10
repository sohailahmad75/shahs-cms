import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import { ROLES } from "../helper";
import InvoiceListPage from "../features/invoice";
import InvoicePage from "../features/invoice/components/InvoicePage";

const invoiceRoutes = [
  {
    path: "/invoices",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]} />
    ),
    children: [
      {
        index: true,
        element: (
          <MainLayout>
            <InvoiceListPage />
          </MainLayout>
        ),
      },
      {
        path: "create",
        element: (
          <MainLayout>
            <InvoicePage />
          </MainLayout>
        ),
      },
      {
        path: "edit/:id",
        element: (
          <MainLayout>
            <InvoicePage />
          </MainLayout>
        ),
      },
    ],
  },
];

export default invoiceRoutes;
