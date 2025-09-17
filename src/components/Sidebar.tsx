import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAdmin } from "../hooks/useAuth";
import type { UserRole } from "../helper";
import { useTheme } from "../context/themeContext";
import ArrowIcon from "../assets/styledIcons/ArrowIcon";
import ShahsIcon from "../assets/styledIcons/ShahsIcon";
import ShahsLogo from "../assets/styledIcons/ShahsLogo";
import { sidebarMenu } from "../constants";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobile: boolean;
  activePanel: string | null;
  setActivePanel: (id: string | null) => void;
}

const Sidebar = ({
  isOpen,
  setIsOpen,
  isCollapsed,
  setIsCollapsed,
  isMobile,
  activePanel,
  setActivePanel,
}: SidebarProps) => {
  const location = useLocation();
  const { admin: activeAdmin } = useAdmin();
  const role = activeAdmin?.admin?.role as UserRole;
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const { isDarkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isMobile
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen, isMobile]);

  const shouldShow = isMobile ? isOpen : true;

  const filtered = sidebarMenu.filter((item) => item.roles.includes(role));
  const active = activePanel
    ? filtered.find((m) => m.id === activePanel)
    : null;

  return (
    <div className="flex h-full">
      {/* Main column */}
      <div
        ref={sidebarRef}
        className={`z-40 ${isDarkMode ? "bg-slate-950 text-white" : "bg-gray-900 text-secondary-100"}
        h-full transition-all duration-300 ${shouldShow ? "block" : "hidden"}
        ${isCollapsed && !isMobile ? "w-16" : "w-64"} fixed md:relative top-0 left-0 shadow-xl`}
      >
        <div className="h-full flex flex-col">
          {isCollapsed && (
            <div className="px-3 py-2 flex justify-center">
              <ShahsIcon />
            </div>
          )}

          <div
            className={`flex items-center px-3 ${isCollapsed ? "py-3 justify-center" : "py-6 justify-between"}`}
          >
            {!isCollapsed && (
              <ShahsLogo textColor={isDarkMode ? "#fff" : "#000"} />
            )}
            {!isMobile && (
              <span
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`${isDarkMode ? "bg-slate-900" : "bg-orange-100"} rounded-full p-2 cursor-pointer`}
                title={isCollapsed ? "Expand" : "Collapse"}
              >
                <ArrowIcon
                  size={16}
                  color="#fff"
                  className={isCollapsed ? "rotate-270" : "rotate-90"}
                />
              </span>
            )}
          </div>

          <ul className="flex flex-col flex-1 space-y-1 px-2">
            {/* everything except settings */}
            {filtered
              .filter((item) => item.id !== "settings")
              .map(({ id, name, icon, link, panel }) => {
                const isItemActive =
                  location.pathname === link || activePanel === id;

                if (panel) {
                  return (
                    <li key={id}>
                      <button
                        onClick={() =>
                          setActivePanel(activePanel === id ? null : id)
                        }
                        className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-4"} py-2 rounded-md transition-all
                ${
                  isItemActive
                    ? `${isDarkMode ? "bg-slate-900 text-primary-100" : "bg-orange-200 text-orange-100"} font-semibold`
                    : `${isDarkMode ? "hover:text-primary-200" : "hover:text-orange-100"} hover:font-semibold`
                }`}
                      >
                        {icon}
                        {!isCollapsed && <span>{name}</span>}
                      </button>
                    </li>
                  );
                }

                return (
                  <li key={id}>
                    <Link
                      to={link!}
                      onClick={() => setActivePanel(null)}
                      className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-4"} py-2 rounded-md transition-all
              ${
                isItemActive
                  ? `${isDarkMode ? "bg-slate-900 text-primary-100" : "bg-orange-200 text-orange-100"} font-semibold`
                  : `${isDarkMode ? "hover:text-primary-200" : "hover:text-orange-100"} hover:font-semibold`
              }`}
                    >
                      {icon}
                      {!isCollapsed && <span>{name}</span>}
                    </Link>
                  </li>
                );
              })}

            {/* settings pinned to bottom */}
            {filtered
              .filter((item) => item.id === "settings")
              .map(({ id, name, icon }) => {
                const isItemActive = activePanel === id;
                return (
                  <li key={id} className="mt-auto">
                    <button
                      onClick={() => setActivePanel(isItemActive ? null : id)}
                      className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-4"} py-2 rounded-md transition-all
              ${
                isItemActive
                  ? `${isDarkMode ? "bg-slate-900 text-primary-100" : "bg-orange-200 text-orange-100"} font-semibold`
                  : `${isDarkMode ? "hover:text-primary-200" : "hover:text-orange-100"} hover:font-semibold`
              }`}
                    >
                      {icon}
                      {!isCollapsed && <span>Settings</span>}
                    </button>
                  </li>
                );
              })}
          </ul>

          {/* Dark Mode Toggle */}
          <div
            className={`flex items-center pb-4 ${isCollapsed ? "justify-center" : "gap-3 px-4"}`}
          >
            <div
              className={`flex items-center w-full justify-between px-3 py-2 rounded-md
              ${isDarkMode ? "bg-slate-900 text-white" : "bg-gray-200 text-gray-800"}`}
            >
              {!isCollapsed && (
                <span>{isDarkMode ? "Dark Mode" : "Light Mode"}</span>
              )}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                />
                <div className="w-11 h-6 bg-white rounded-full shadow-inner">
                  <div
                    className={`absolute top-[2px] left-[2px] w-5 h-5 rounded-full transition-transform duration-300
                    ${isDarkMode ? "translate-x-full bg-slate-950" : "translate-x-0 bg-gray-500"}`}
                  />
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel column (was SettingsPanel) */}
      {active?.panel && (
        <div
          className={`${isDarkMode ? "bg-slate-900 text-white" : "bg-gray-900 text-secondary-100"}
            h-full w-56 md:relative md:static fixed top-0 left-[${isCollapsed && !isMobile ? "4rem" : "16rem"}]
            hidden md:flex flex-col shadow-xl transition-all duration-500 ease-in-out`}
          style={{ width: isCollapsed && !isMobile ? 60 : 220 }} // keeps visual width similar to previous "w-55"
        >
          <div
            className={`${isDarkMode ? "text-slate-500" : "text-orange-600"} px-3 py-6`}
          >
            {!isCollapsed && (
              <span className="text-2xl font-semibold">
                {active.panel.title}
              </span>
            )}
          </div>

          <ul className="flex-1 space-y-1 px-2 mt-auto">
            {active.panel.children
              .filter((c) => c.roles.includes(role))
              .map((c) => {
                const activeChild = location.pathname === c.link;
                return (
                  <li key={c.id}>
                    <Link
                      to={c.link}
                      className={`flex items-center text-sm ${isCollapsed ? "justify-center" : "gap-1 px-4"}
                        py-2 rounded-md transition-all
                        ${
                          activeChild
                            ? `${isDarkMode ? "bg-slate-800" : "bg-orange-500"} text-white font-semibold`
                            : `${isDarkMode ? "hover:bg-slate-950" : "hover:bg-orange-500"} hover:text-white`
                        }`}
                    >
                      {c.icon ?? (
                        <span className="w-4 h-4 rounded-full bg-white/20" />
                      )}
                      {!isCollapsed && <span>{c.name}</span>}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
