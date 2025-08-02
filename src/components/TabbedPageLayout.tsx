import { useLocation, useNavigate } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { useMemo } from "react";

export interface Tab {
  label: string;
  path: string;
}

interface TabbedPageLayoutProps extends PropsWithChildren {
  title: string;
  tabs: Tab[];
}

const TabbedPageLayout = ({ title, tabs, children }: TabbedPageLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = useMemo(() => {
    const sortedTabs = [...tabs].sort((a, b) => b.path.length - a.path.length); // longest first
    const foundTab = sortedTabs.findIndex(
      (tab) =>
        location.pathname === tab.path ||
        location.pathname.startsWith(tab.path + "/"),
    );
    return foundTab >= 0
      ? tabs.findIndex((tab) => tab.path === sortedTabs[foundTab].path)
      : -1;
  }, [location.pathname, tabs]);

  return (
    <div className="p-2">
      <h1 className="text-3xl font-semibold text-primary mb-4">{title}</h1>
      <div className="border-b border-gray-200 flex gap-6 mb-6">
        {tabs.map((tab, i) => (
          <div
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`relative cursor-pointer pb-2 font-medium transition-all duration-100
              ${
                i === activeTab
                  ? "text-primary-100 after:scale-x-100"
                  : "text-gray-500 hover:text-primary-100 after:scale-x-0"
              }
              after:content-[''] after:absolute after:left-0 after:-bottom-0 after:h-[2px] after:w-full after:bg-primary-100 after:transition-transform after:duration-100 after:origin-left
            `}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded shadow-sm">
        {children}
      </div>
    </div>
  );
};

export default TabbedPageLayout;
