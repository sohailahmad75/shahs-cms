import React, { useEffect, useRef, useState, type JSX } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAdmin } from "../hooks/useAuth";
import type { SidebarSubMenuItem, UserRole } from "../helper";
import ArrowIcon from "../assets/styledIcons/ArrowIcon";
import SettingIcon from "../assets/styledIcons/SettingIcon";

interface SettingsPanelProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobile: boolean;
  menuItems: {
    id: string;
    name: string;
    icon: JSX.Element;
    link?: string;
    children?: {
      id: string;
      name: string;
      link: string;
      roles: UserRole[];
    }[];
    roles: UserRole[];
  }[];
  panelTitle?: string;
  panelIcon?: JSX.Element;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  isCollapsed,
  isMobile,
  menuItems,
  panelTitle = "Settings",
  panelIcon = <SettingIcon size={24} color="#ea580c" />,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { admin: activeAdmin } = useAdmin();
  const role = activeAdmin?.admin?.role as UserRole;
  const [openSubmenuId, setOpenSubmenuId] = useState<string | null>(null);

  const isAnyChildActive = (
    children: SidebarSubMenuItem[] | undefined,
    pathname: string,
  ) => children?.some((child) => child.link === pathname);

  const shouldShow = isMobile ? isOpen : true;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={panelRef}
      className={`h-full shadow-lg flex flex-col bg-gray-900 text-secondary-100 
        ${shouldShow ? "block" : "hidden"} 
        ${isCollapsed && !isMobile ? "w-16" : "w-55"} 
        fixed md:relative top-0 left-0 shadow-xl transition-all duration-500 ease-in-out`}
    >
      <div className="h-full flex flex-col">
        <div
          className={`text-orange-600 flex items-center px-3 
            ${isCollapsed ? "py-3 justify-center" : "py-6 justify-start"}`}
        >
          {isCollapsed ? (
            <div className="flex justify-center w-full mt-12">
              {panelIcon}
            </div>
          ) : (
            <span className="text-2xl font-semibold mt-2">{panelTitle}</span>
          )}
        </div>

        <ul className="flex-1 space-y-1 px-2 mt-3">
          {menuItems
            .filter((item) => item.roles.includes(role))
            .map(({ id, name, icon, link, children }) => {
              const childIsActive =
                children && isAnyChildActive(children, location.pathname);
              const isActive = location.pathname === link || childIsActive;

              return (
                <li key={id} className="relative group">
                  {link ? (
                    <Link
                      to={link}
                      className={`flex items-center w-full ${isCollapsed ? "justify-center" : "gap-3 px-4"
                        } py-2 rounded-md transition-all duration-300 ease-in-out
                        ${isActive
                          ? "bg-orange-500 text-white font-semibold"
                          : "hover:bg-orange-500 hover:text-white hover:font-semibold"
                        }`}
                    >
                      <div>{icon}</div>
                      {!isCollapsed && <span>{name}</span>}
                    </Link>
                  ) : (
                    <div>
                      <div
                        onClick={() =>
                          setOpenSubmenuId(
                            openSubmenuId === id || childIsActive ? null : id,
                          )
                        }
                        className={`flex items-center w-full ${isCollapsed ? "justify-center" : "gap-3 px-4"
                          } py-2 rounded-md cursor-pointer transition-all duration-300 ease-in-out
                          ${openSubmenuId === id || isActive
                            ? "bg-orange-500 text-white font-semibold"
                            : "hover:bg-orange-500 hover:text-white hover:font-semibold"
                          }`}
                      >
                        <div>{icon}</div>
                        {!isCollapsed && <span>{name}</span>}
                        {!isCollapsed && (
                          <span className="ml-auto transition-transform duration-300">
                            <ArrowIcon
                              className={`transition-transform duration-300 ${openSubmenuId === id || childIsActive
                                ? "rotate-180"
                                : ""
                                }`}
                            />
                          </span>
                        )}
                      </div>

                      {children && (
                        <ul
                          className={`transition-all duration-300 overflow-hidden ${isCollapsed && !isMobile
                            ? "absolute left-full top-0 z-50 bg-white text-gray-800 shadow-md rounded hidden group-hover:block min-w-[180px] p-1"
                            : openSubmenuId === id || isMobile
                              ? "ml-6 mt-1 space-y-1 max-h-[500px] opacity-100"
                              : "max-h-0 opacity-0"
                            }`}
                          style={{
                            transition: "all 0.4s ease",
                          }}
                        >
                          {children
                            .filter((sub) => sub.roles.includes(role))
                            .map(({ id: subId, name: subName, link: subLink }) => (
                              <li key={subId}>
                                <Link
                                  to={subLink}
                                  className={`flex items-center gap-2 p-2 text-sm rounded-md transition-all duration-300
                                    ${location.pathname === subLink
                                      ? "bg-orange-400 text-white font-semibold"
                                      : "hover:bg-orange-400 hover:text-white"
                                    }`}
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
      </div>
    </div>
  );
};

export default SettingsPanel;
