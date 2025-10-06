import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import BankConnected from "../features/dashboard/BankConnected";
import BankTransactions from "../features/transactions";
import TransactionsWrapper from "../features/transactions/TransactionsWrapper";
import { ROLES } from "../helper";
import AccountsPage from "../features/finance/AccountsPage";

const transactionsRoutes = [
  {
    element: <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]} />,
    children: [
      {
        path: "/bank/connected",
        element: (
          <MainLayout>
            <BankConnected />
          </MainLayout>
        ),
      },
      {
        path: "/transactions",
        element: (
          <MainLayout>
            <TransactionsWrapper /> {/* <- renders <Outlet /> */}
          </MainLayout>
        ),
        children: [
          { index: true, element: <BankTransactions /> }, // default tab
          { path: "bank-transactions", element: <BankTransactions /> },
          { path: "app-transactions", element: <BankTransactions /> },
          { path: "chart-of-accounts", element: <AccountsPage /> },
        ],
      },
    ],
  },
];

export default transactionsRoutes;
