import DashboardIcon from "../assets/styledIcons/Dashboad";
import TransactionIcon from "../assets/styledIcons/TransactionIcon";
import MenuManagerIcon from "../assets/styledIcons/MenuManagerIcon";
import HouseCheckIcon from "../assets/styledIcons/HouseCheckIcon";
import InvoiceIcon from "../assets/styledIcons/InvoiceIcon";
import KioskIcon from "../assets/styledIcons/KioskIcon";
import SettingIcon from "../assets/styledIcons/SettingIcon";
import DocumentIcon from "../assets/styledIcons/DocumentIcon";
import UserIcon from "../assets/styledIcons/UserIcon";
import { ROLES, type UserRole } from "../helper";
import type { JSX } from "react";
// import InventoryIcon from "../assets/styledIcons/InventoryIcon";
import ProductsIcon from "../assets/styledIcons/ProductsIcon";
import OrdersIcon from "../assets/styledIcons/ordersIcon";
import ProfileSettingIcon from "../assets/styledIcons/ProfileSettingIcon";
import SalesIcon from "../assets/styledIcons/SalesIcon";

export type SidebarMenu = {
  id: string;
  name: string;
  icon: JSX.Element;
  link?: string;
  roles: UserRole[];
  panel?: {
    title: string;
    children: {
      id: string;
      name: string;
      link: string;
      roles: UserRole[];
      icon?: JSX.Element;
    }[];
  };
};

export const sidebarMenu: SidebarMenu[] = [
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
    icon: <InvoiceIcon />,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    panel: {
      title: "Invoices",
      children: [
        {
          id: "invoices",
          name: "Invoices",
          link: "/invoices",
          roles: [ROLES.SUPER_ADMIN],
          icon: <InvoiceIcon />,
        },
      ],
    },
  },
  {
    id: "transactions",
    name: "Transactions",
    icon: <TransactionIcon />,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    panel: {
      title: "Transactions",
      children: [
        {
          id: "bank-transactions",
          name: "Bank Transactions",
          link: "/transactions/bank-transactions",
          roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
          icon: <TransactionIcon />,
        },
        {
          id: "app-transactions",
          name: "App Transactions",
          link: "/transactions/app-transactions",
          roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
          icon: <TransactionIcon />,
        },

        {
          id: "chart-of-accounts",
          name: "Chart of Account",
          link: "/transactions/chart-of-accounts",
          roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
          icon: <TransactionIcon />,
        },
      ],
    },
  },
  {
    id: "sales",
    name: "Sales",
    icon: <SalesIcon />,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    panel: {
      title: "Sales",
      children: [
        {
          id: "sales-products",
          name: "Products",
          link: "/sales/products",
          roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
          icon: <ProductsIcon />,
        },
        {
          id: "sales-product-categories",
          name: "Product Categories",
          link: "/sales/product-categories",
          roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
          icon: <ProductsIcon />,
        },
        {
          id: "sales-store-orders",
          name: "Store Orders",
          link: "/sales/store-orders",
          roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
          icon: <ProductsIcon />,
        },
      ],
    },
  },
  {
    id: "menu-manager",
    name: "Menu Manager",
    icon: <MenuManagerIcon />,
    link: "/menus",
    roles: [ROLES.SUPER_ADMIN],
  },
  {
    id: "stores",
    name: "Stores",
    icon: <HouseCheckIcon />,
    link: "/stores",
    roles: [ROLES.SUPER_ADMIN],
  },
  {
    id: "users",
    name: "Users",
    icon: <UserIcon />,
    link: "/users",
    roles: [ROLES.SUPER_ADMIN],
  },
  {
    id: "kiosks",
    name: "Kiosks",
    icon: <KioskIcon />,
    link: "/kiosks",
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    id: "orders",
    name: "Orders",
    icon: <OrdersIcon />,
    link: "/orders",
    roles: [ROLES.SUPER_ADMIN],
  },
  {
    id: "settings",
    name: "Settings",
    icon: <SettingIcon />,
    roles: [ROLES.SUPER_ADMIN],
    panel: {
      title: "Settings",
      children: [
        {
          id: "document-type",
          name: "Document Type",
          link: "/setting/document-type",
          roles: [ROLES.SUPER_ADMIN],
          icon: <DocumentIcon />,
        },
        {
          id: "profile-settings",
          name: "Profile Settings",
          link: "/setting/profile-settings",
          roles: [ROLES.SUPER_ADMIN],
          icon: <ProfileSettingIcon size={26}/>,
        },
      ],
    },
  },
];
