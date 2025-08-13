import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAdmin } from "../hooks/useAuth";
import type { SidebarSubMenuItem, UserRole } from "../helper";
import ArrowIcon from "../assets/styledIcons/ArrowIcon";
import ShahsIcon from "../assets/styledIcons/ShahsIcon";
import ShahsLogo from "../assets/styledIcons/ShahsLogo";
import { sidebarMenuList } from "../constants";
import { useTheme } from "../context/themeContext";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobile: boolean;
  openSettingsPanel: () => void;
  openInvoicesPanel: () => void;
  openTransactionsPanel: () => void;
  activePanel: "settings" | "invoice" | "transactions" | null;
  setActivePanel: (value: "settings" | "invoice" | "transactions" | null) => void;
}


const Sidebar = ({
  isOpen,
  setIsOpen,
  isCollapsed,
  setIsCollapsed,
  isMobile,
  openSettingsPanel,
  openInvoicesPanel,
  openTransactionsPanel,
  setActivePanel,
  activePanel
}: SidebarProps) => {
  const location = useLocation();
  const { admin: activeAdmin } = useAdmin();
  const role = activeAdmin?.admin?.role as UserRole;
  console.log("activeUserRole:", role, typeof role);
  const [openSubmenuId, setOpenSubmenuId] = useState<string | null>(null);
  const isAnyChildActive = (
    children: SidebarSubMenuItem[] | undefined,
    pathname: string,
  ) => children?.some((child) => child.link === pathname);

  const sidebarRef = useRef<HTMLDivElement | null>(null);
const { isDarkMode, toggleDarkMode } = useTheme()
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

  return (
    <div
      ref={sidebarRef}
      className={`z-40 ${isDarkMode ? 'bg-slate-950' : 'bg-gray-900'}   ${isDarkMode ? 'text-white' : 'text-secondary-100'} h-full transition-all duration-300 
        ${shouldShow ? "block" : "hidden"} 
        ${isCollapsed && !isMobile ? "w-16" : "w-64"} 
        fixed md:relative top-0 left-0 shadow-xl
         `}
    >
      <div className="h-full flex flex-col">
        {isCollapsed && (
          <div className="px-3 py-2 flex justify-center">
            <ShahsIcon />
          </div>
        )}

        <div
          className={`flex items-center px-3 ${isCollapsed ? "py-3 justify-center" : "py-6 justify-between"
            }`}
        >
          {!isCollapsed && <ShahsLogo />}
          {!isMobile && (
            <span
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`cursor-pointer ${isDarkMode ? 'bg-slate-900' : 'bg-orange-100'} bg-orange-100  rounded-full p-2 transition-transform duration-300 ease-in-out`}
              title={isCollapsed ? "Expand" : "Collapse"}
            >
              <ArrowIcon
                size={16}
                className={isCollapsed ? "rotate-270" : "rotate-90"}
              />
            </span>
          )}
        </div>
        <ul className="flex-1 space-y-1 px-2">
          {sidebarMenuList
            .filter((item) => item.id !== "setting" && item.roles.includes(role))
            .map(({ id, name, icon, link, children }) => {
              const childIsActive = children && isAnyChildActive(children, location.pathname);
              const isActive = (location.pathname === link || childIsActive) && activePanel === null;


              if (id === 'invoice' || id === 'transactions') {
                return (
                  <li key={id}>
                    <div
                      onClick={
                        id === 'invoice' ? openInvoicesPanel : openTransactionsPanel
                      }
                      className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-4"} py-2 rounded-md cursor-pointer transition-all duration-300 ease-in-out
                        ${activePanel === id ? `${isDarkMode ? 'bg-slate-900' : 'bg-orange-200'} ${isDarkMode ? 'text-slate-500' : 'text-orange-100'} font-semibold shadow-xs` : ` ${isDarkMode ? 'hover:text-slate-600' : 'hover:text-orange-100 '} hover:font-semibold`}`}
                    >
                      <div>{icon}</div>
                      {!isCollapsed && <span>{name}</span>}
                    </div>
                  </li>
                );
              }

              return (
                <li key={id} className="relative group">
                  {link ? (
                    <Link
                      to={link}
                      onClick={() => setActivePanel(null)} 
                      className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-4"} py-2 rounded-md transition-all duration-300 ease-in-out
                ${isActive ? `${isDarkMode ? 'bg-slate-900' : 'bg-orange-200'} ${isDarkMode ? 'text-slate-500' : 'text-orange-100'} font-semibold shadow-xs` : ` ${isDarkMode ? 'hover:text-slate-600' : 'hover:text-orange-100 '} hover:font-semibold`}`}
                    >
                      <div>{icon}</div>
                      {!isCollapsed && <span>{name}</span>}
                    </Link>
                  ) : (
                    <div>
                      <div
                        onClick={() => setOpenSubmenuId(openSubmenuId === id || childIsActive ? null : id)}
                        className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-4"} py-2 rounded-md cursor-pointer transition-all duration-300 ease-in-out
                  ${isActive ? "bg-orange-200 text-orange-100 font-semibold shadow-xs" : "hover:text-orange-100 hover:font-semibold"}`}
                      >
                        <div>{icon}</div>
                        {!isCollapsed && <span>{name}</span>}
                        {!isCollapsed && children && (
                          <span className="ml-auto transition-transform duration-300">
                            <ArrowIcon className={`transition-transform duration-300 ${openSubmenuId === id || childIsActive ? "rotate-180" : ""}`} />
                          </span>
                        )}
                      </div>

                      {children && (
                        <ul
                          className={`transition-all duration-300 overflow-hidden ${isCollapsed && !isMobile
                            ? "absolute left-full top-0 z-50 bg-white text-gray-800 shadow-md rounded hidden group-hover:block min-w-[180px] p-1"
                            : openSubmenuId === id || isMobile
                              ? "ml-6 mt-1 space-y-1"
                              : "hidden"
                            }`}
                        >
                          {children
                            .filter((sub) => sub.roles.includes(role))
                            .map(({ id: subId, name: subName, link: subLink }) => (
                              <li key={subId}>
                                <Link
                                  to={subLink}
                                  className={`flex items-center gap-2 p-2 text-sm rounded-md transition-all duration-300
                            ${location.pathname === subLink ? "bg-orange-200 text-orange-100 font-semibold" : "hover:text-orange-100 hover:font-semibold"}`}
                                >
                                  {isCollapsed && <span>•</span>}
                                  <span>{subName}</span>
                                </Link>
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
        </ul>
        <div className="px-2 py-2">
          <div
            onClick={openSettingsPanel}
            className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-4"}
      py-2 rounded-md cursor-pointer transition-all duration-300 ease-in-out
      ${activePanel === "settings"
                ? `${isDarkMode ? 'bg-slate-900' : 'bg-orange-200'} ${isDarkMode ? 'text-slate-500' : 'text-orange-100'} font-semibold shadow-xs` : ` ${isDarkMode ? 'hover:text-slate-600' : 'hover:text-orange-100 '} hover:font-semibold`}`}
          >
            <div>{sidebarMenuList.find(item => item.id === "setting")?.icon}</div>
            {!isCollapsed && <span>Settings</span>}
          </div>
        </div>
        <div
          className={`flex items-center pb-4 ${isCollapsed ? "justify-center" : "gap-3 px-4"}
    py-2 rounded-md cursor-pointer transition-all duration-300 ease-in-out`}
        >
          <div
            className={`flex items-center w-full justify-between px-3 py-2 rounded-md
      ${isDarkMode ? "bg-slate-900 text-white" : "bg-gray-200 text-gray-800"}`}
          >
            {!isCollapsed && <span>{isDarkMode ? "Dark Mode" : "Light Mode"}</span>}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isDarkMode}
                onChange={toggleDarkMode}
              />
              <div
                className={`w-11 h-6 bg-white rounded-full transition-colors duration-300
        peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-slate-900 shadow-inner`}
              >
                <div
                  className={`absolute top-[2px] left-[2px] w-5 h-5 bg-gray-500 rounded-full transition-transform duration-300
          ${isDarkMode ? "translate-x-full bg-slate-950" : "translate-x-0"}`}
                ></div>
              </div>
            </label>
          </div>
        </div>


      </div>
    </div>
  );
};

export default Sidebar;
