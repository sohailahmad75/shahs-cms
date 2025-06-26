import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ShahsLogo from "../assets/styledIcons/ShahsLogo";
import MenuIcon from "../assets/styledIcons/MenuIcon";

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

  // Click outside to close on mobile
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
      className={`z-40 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] bg-[linear-gradient(to_bottom,_#ffffff_0%,_#f8f8f8_100%,_#ffffff_100%)] text-white h-full transition-all duration-300 
        ${shouldShow ? "block" : "hidden"} 
        ${isCollapsed && !isMobile ? "w-20" : "w-64"} 
        fixed md:relative top-0 left-0
      `}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 py-3">
          {!isCollapsed && <ShahsLogo />}
          {!isMobile && (
            <span
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-white cursor-pointer bg-primary-100 hover:text-white p-2 rounded transition-colors duration-200"
              title={isCollapsed ? "Expand" : "Collapse"}
            >
              <MenuIcon />
            </span>
          )}
        </div>

        <ul className="flex-1 space-y-1 px-2">
          <li>
            <Link
              to="/dashboard"
              className="flex items-center gap-3 p-2 rounded hover:bg-red-500"
            >
              <img src="/assets/img/icons/dashboard.svg" className="w-5 h-5" />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </li>

          <li>
            <Link
              to="/products"
              className="flex items-center gap-3 p-2 rounded hover:bg-red-500"
            >
              <img src="/assets/img/icons/product.svg" className="w-5 h-5" />
              {!isCollapsed && <span>Products</span>}
            </Link>
          </li>

          <li>
            <Link
              to="/sales"
              className="flex items-center gap-3 p-2 rounded hover:bg-red-500"
            >
              <img src="/assets/img/icons/sales1.svg" className="w-5 h-5" />
              {!isCollapsed && <span>Sales</span>}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
