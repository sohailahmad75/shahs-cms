import { Outlet } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import { ROLES } from "../helper";

import InvoiceListPage from "../features/invoice";
import InvoicePage from "../features/invoice/components/InvoicePage";

const invoiceRoutes = [
  {
    element: <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]} />,
    children: [
      {
        path: "/invoices",
        element: (
          <MainLayout>
            <Outlet />
          </MainLayout>
        ),
        children: [
          { index: true, element: <InvoiceListPage /> },
          { path: "create", element: <InvoicePage /> },
          { path: "edit/:id", element: <InvoicePage /> },
        ],
      },
    ],
  },
];

export default invoiceRoutes;
