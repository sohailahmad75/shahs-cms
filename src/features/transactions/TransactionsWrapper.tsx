import TabbedPageLayout from "../../components/TabbedPageLayout";
import { Outlet } from "react-router-dom";

const transactionTabs = [
  { label: "Bank transactions", path: "/transactions/bank-transactions" },
  { label: "App transactions", path: "/transactions/app-transactions" },
  { label: "Chart of accounts", path: "/transactions/chart-of-accounts" },
];

const TransactionsWrapper = () => {
  return (
    <TabbedPageLayout title="Transactions" tabs={transactionTabs}>
      <Outlet />
    </TabbedPageLayout>
  );
};

export default TransactionsWrapper;
