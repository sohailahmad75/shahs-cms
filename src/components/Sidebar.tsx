import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../hooks/useAuth";
import { UserRole } from "../helper";
import ArrowIcon from "../assets/styledIcons/ArrowIcon";
import ShahsIcon from "../assets/styledIcons/ShahsIcon";
import ShahsLogo from "../assets/styledIcons/ShahsLogo";
import { sidebarMenuList } from "../constants";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobile: boolean;
}

const Sidebar = ({
  isOpen,
  setIsOpen,
  isCollapsed,
  setIsCollapsed,
  isMobile,
}: SidebarProps) => {
  const sidebarRef = useRef(null);
  const location = useLocation();
  const { user: activeUser } = useUser();
  const role = activeUser?.user?.role as UserRole;
  const [openSubmenuId, setOpenSubmenuId] = useState<string | null>(null);
  const isAnyChildActive = (children: any[], pathname: string) =>
    children?.some((child) => child.link === pathname);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
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
      className={`z-40 bg-gray-900 text-secondary-100 h-full transition-all duration-300 
        ${shouldShow ? "block" : "hidden"} 
        ${isCollapsed && !isMobile ? "w-16" : "w-64"} 
        fixed md:relative top-0 left-0 shadow-xl`}
    >
      <div className="h-full flex flex-col">
        {isCollapsed && (
          <div className="px-3 py-2 flex justify-center">
            <ShahsIcon />
          </div>
        )}

        <div
          className={`flex items-center px-3 ${
            isCollapsed ? "py-3 justify-center" : "py-6 justify-between"
          }`}
        >
          {!isCollapsed && <ShahsLogo />}
          {!isMobile && (
            <span
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-white cursor-pointer bg-orange-100  rounded-full p-2 transition-transform duration-300 ease-in-out"
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
                      className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-4"} py-2 rounded-md transition-all duration-300 ease-in-out
              ${
                isActive
                  ? "bg-orange-200 text-orange-100 font-semibold shadow-xs"
                  : "hover:text-orange-100 hover:font-semibold"
              }
            `}
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
                        className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-4"} py-2 rounded-md cursor-pointer transition-all duration-300 ease-in-out
                ${
                  isActive
                    ? "bg-orange-200 text-orange-100 font-semibold shadow-xs"
                    : "hover:text-orange-100 hover:font-semibold"
                }
              `}
                      >
                        <div>{icon}</div>
                        {!isCollapsed && <span>{name}</span>}
                        {!isCollapsed && (
                          <span className="ml-auto transition-transform duration-300">
                            <ArrowIcon
                              className={`transition-transform duration-300 ${
                                openSubmenuId === id || childIsActive
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </span>
                        )}
                      </div>

                      {children && (
                        <ul
                          className={`transition-all duration-300 overflow-hidden ${
                            isCollapsed && !isMobile
                              ? "absolute left-full top-0 z-50 bg-white text-gray-800 shadow-md rounded hidden group-hover:block min-w-[180px] p-1"
                              : openSubmenuId === id || isMobile
                                ? "ml-6 mt-1 space-y-1"
                                : "hidden"
                          }`}
                        >
                          {children
                            .filter((sub) => sub.roles.includes(role))
                            .map(
                              ({ id: subId, name: subName, link: subLink }) => (
                                <li key={subId}>
                                  <Link
                                    to={subLink}
                                    className={`flex items-center gap-2 p-2 text-sm rounded-md transition-all duration-300
                          ${
                            location.pathname === subLink
                              ? "bg-orange-200 text-orange-100 font-semibold"
                              : "hover:text-orange-100 hover:font-semibold"
                          }
                        `}
                                  >
                                    {isCollapsed && <span>•</span>}
                                    <span>{subName}</span>
                                  </Link>
                                </li>
                              ),
                            )}
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

export default Sidebar;
