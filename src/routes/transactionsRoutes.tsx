import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import BankConnected from "../features/dashboard/BankConnected";
import BankTransactions from "../features/transactions";
import TransactionsWrapper from "../features/transactions/TransactionsWrapper";
import { ROLES } from "../helper";

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
        path: "/transactions/bank-transactions",
        element: (
          <MainLayout>
            <TransactionsWrapper>
              <BankTransactions />
            </TransactionsWrapper>
          </MainLayout>
        ),
      },
      {
        path: "/transactions/app-transactions",
        element: (
          <MainLayout>
            <TransactionsWrapper>
              <BankTransactions />
            </TransactionsWrapper>
          </MainLayout>
        ),
      },
    ],
  },
];

export default transactionsRoutes;
