import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import MenuIcon from "../assets/styledIcons/MenuIcon";
import DashboardIcon from "../assets/styledIcons/Dashboad";
import { useUser } from "../hooks/useAuth";
import { ROLES, UserRole } from "../helper";
import ArrowIcon from "../assets/styledIcons/ArrowIcon";
import TransactionIcon from "../assets/styledIcons/TransactionIcon";
import ShahsIcon from "../assets/styledIcons/ShahsIcon";
import ShahsLogo from "../assets/styledIcons/ShahsLogo";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobile: boolean;
}

const menuList = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: <DashboardIcon />,
    link: "/dashboard",
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    id: "invoice",
    name: "Invoice",
    icon: <DashboardIcon />,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    children: [
      {
        id: "invoices",
        name: "Invoices",
        link: "/invoices",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },
      {
        id: "add-product",
        name: "Add Product",
        link: "/invoice/add",
        roles: [ROLES.ADMIN],
      },
    ],
  },
  {
    id: "transactions",
    name: "Transactions",
    icon: <TransactionIcon />,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    children: [
      {
        id: "bank-transactions",
        name: "Bank Transactions",
        link: "/transactions/bank-transactions",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },
      {
        id: "app-transactions",
        name: "App Transactions",
        link: "/transactions/app-transactions",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },
    ],
  },
  {
    id: "sales",
    name: "Sales",
    icon: <DashboardIcon />,
    link: "/sales",
    roles: ["admin"],
  },
];

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
      className={`z-40 bg-white text-black h-full transition-all duration-300 
        ${shouldShow ? "block" : "hidden"} 
        ${isCollapsed && !isMobile ? "w-20" : "w-64"} 
        fixed md:relative top-0 left-0 shadow-lg`}
    >
      <div className="h-full flex flex-col">
        {isCollapsed && (
          <div className="px-4 py-3 pb-1 flex justify-center">
            <ShahsIcon />
          </div>
        )}
        <div className="flex items-center justify-between px-4 py-3">
          {!isCollapsed && <ShahsLogo />}
          {!isMobile && (
            <span
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`text-white cursor-pointer bg-orange-100 hover:text-white rounded-full p-3 transition-transform duration-300 ease-in-out ${isCollapsed ? "rotate-0" : "rotate-180"}`}
              title={isCollapsed ? "Expand" : "Collapse"}
            >
              <MenuIcon />
            </span>
          )}
        </div>

        <ul className="flex-1 space-y-1 px-2">
          {menuList
            .filter((item) => item.roles.includes(role))
            .map(({ id, name, icon, link, children }) => (
              <li key={id} className="relative group">
                {link ? (
                  <Link
                    to={link}
                    className={`flex items-center gap-3 p-2 py-3 rounded hover:bg-orange-100 hover:text-white transition duration-300 ease-in-out
                    ${location.pathname === link ? "bg-orange-100 text-white" : ""}
                  `}
                  >
                    <div className="w-5 h-5">{icon}</div>
                    {!isCollapsed && <span>{name}</span>}
                  </Link>
                ) : (
                  <div>
                    <div
                      onClick={() =>
                        setOpenSubmenuId(openSubmenuId === id ? null : id)
                      }
                      className="flex items-center gap-3 p-2 py-3 rounded cursor-pointer hover:bg-orange-100 hover:text-white transition duration-300 ease-in-out"
                    >
                      <div className="w-5 h-5">{icon}</div>
                      {!isCollapsed && <span>{name}</span>}
                      {!isCollapsed && (
                        <span className="ml-auto">
                          {openSubmenuId === id ? (
                            <ArrowIcon className="rotate-180" />
                          ) : (
                            <ArrowIcon />
                          )}
                        </span>
                      )}
                    </div>

                    {children && (
                      <ul
                        className={`transition-all duration-300 ${
                          isCollapsed && !isMobile
                            ? "absolute left-full top-0 z-50 bg-white shadow-md rounded hidden group-hover:block min-w-[160px] p-1"
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
                                  className={`flex items-center gap-2 p-2 text-sm rounded hover:bg-orange-100 hover:text-white transition duration-200
                                ${location.pathname === subLink ? "bg-orange-100 text-white" : ""}
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
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
