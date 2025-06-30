import { useLocation, useNavigate } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { useMemo } from "react";

const tabs = [
  { label: "Bank transactions", path: "/transactions/bank-transactions" },
  { label: "App transactions", path: "/transactions/app-transactions" },
];

const TransactionsWrapper = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = useMemo(() => {
    return tabs.findIndex((tab) => location.pathname.startsWith(tab.path));
  }, [location.pathname]);

  return (
    <div className="p-2">
      <h1 className="text-3xl font-semibold">Transactions</h1>
      <div className="py-7 min-h-screen">
        <div className="flex gap-6 border-b pb-2 mb-6 border-gray-100">
          {tabs.map((tab, i) => (
            <div
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`relative cursor-pointer pb-1 transition-all duration-100 ease-in-out font-semibold
            ${
              i === activeTab
                ? "text-primary-100 after:scale-x-100"
                : "text-gray-500 hover:text-primary-100 font-normal after:scale-x-0"
            }
            after:content-[''] after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-full after:bg-primary-100 after:transition-transform after:duration-100 after:origin-left
          `}
            >
              {tab.label}
            </div>
          ))}
        </div>

        <div className="bg-white p-6 py-10 rounded shadow-sm">{children}</div>
      </div>
    </div>
  );
};

export default TransactionsWrapper;
