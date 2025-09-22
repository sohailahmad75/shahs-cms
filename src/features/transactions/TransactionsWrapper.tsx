import type { PropsWithChildren } from "react";
import TabbedPageLayout from "../../components/TabbedPageLayout";

const transactionTabs = [
  { label: "Bank transactions", path: "/transactions/bank-transactions" },
  { label: "App transactions", path: "/transactions/app-transactions" },
  { label: "Chart of accounts", path: "/transactions/chart-of-accounts" },
];

const TransactionsWrapper = ({ children }: PropsWithChildren) => {
  return (
    <TabbedPageLayout title="Transactions" tabs={transactionTabs}>
      {children}
    </TabbedPageLayout>
  );
};

export default TransactionsWrapper;
