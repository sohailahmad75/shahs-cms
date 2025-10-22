import { NavLink } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { useTheme } from "../context/themeContext";

export interface Tab {
  label: string;
  path: string;
}

interface TabbedPageLayoutProps extends PropsWithChildren {
  title: string;
  tabs: Tab[];
}

const TabbedPageLayout = ({ title, tabs, children }: TabbedPageLayoutProps) => {
  const { isDarkMode } = useTheme();
  return (
    <div className="p-2">
      <h1 className="text-3xl font-semibold text-primary mb-4">{title}</h1>
      <div className="border-b border-gray-200 flex gap-6 mb-6">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end 
            className={({ isActive }) =>
              `relative cursor-pointer pb-2 font-medium transition-all
     ${isActive ? "text-primary-100 after:scale-x-100" : "text-gray-500 hover:text-primary-100 after:scale-x-0"}
     after:content-[''] after:absolute after:left-0 after:-bottom-0 after:h-[2px] after:w-full after:bg-primary-100 after:transition-transform after:origin-left`
            }
          >
            {tab.label}
          </NavLink>

        ))}
      </div>

      <div
        className={`${isDarkMode ? "bg-slate-950" : "bg-white"}  p-6 rounded shadow-sm`}
      >
        {children}
      </div>
    </div>
  );
};

export default TabbedPageLayout;
