import DashboardIcon from "../assets/styledIcons/Dashboad";
import { ROLES, type UserRole } from "../helper";
import TransactionIcon from "../assets/styledIcons/TransactionIcon";
import MenuManagerIcon from "../assets/styledIcons/MenuManagerIcon";
import type { JSX } from "react";
import HouseCheckIcon from "../assets/styledIcons/HouseCheckIcon";

export const sidebarMenuList: {
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
}[] = [
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
    id: "sales",
    name: "Sales",
    icon: <DashboardIcon />,
    link: "/sales",
    roles: [ROLES.SUPER_ADMIN],
  },
];

export const ProfileImage: string =
  "https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fwww.gravatar.com%2Favatar%2F2c7d99fe281ecd3bcd65ab915bac6dd5%3Fs%3D250";

export const ProductImage: string =
  "https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fwww.gravatar.com%2Favatar%2F2c7d99fe281ecd3bcd65ab915bac6dd5%3Fs%3D250";

export const overviewData = [
  {
    name: "Jan",
    total: 1500,
  },
  {
    name: "Feb",
    total: 2000,
  },
  {
    name: "Mar",
    total: 1000,
  },
  {
    name: "Apr",
    total: 5000,
  },
  {
    name: "May",
    total: 2000,
  },
  {
    name: "Jun",
    total: 5900,
  },
  {
    name: "Jul",
    total: 2000,
  },
  {
    name: "Aug",
    total: 5500,
  },
  {
    name: "Sep",
    total: 2000,
  },
  {
    name: "Oct",
    total: 4000,
  },
  {
    name: "Nov",
    total: 1500,
  },
  {
    name: "Dec",
    total: 2500,
  },
];

export const recentSalesData = [
  {
    id: 1,
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    image: ProfileImage,
    total: 1500,
  },
  {
    id: 2,
    name: "James Smith",
    email: "james.smith@email.com",
    image: ProfileImage,
    total: 2000,
  },
  {
    id: 3,
    name: "Sophia Brown",
    email: "sophia.brown@email.com",
    image: ProfileImage,
    total: 4000,
  },
  {
    id: 4,
    name: "Noah Wilson",
    email: "noah.wilson@email.com",
    image: ProfileImage,
    total: 3000,
  },
  {
    id: 5,
    name: "Emma Jones",
    email: "emma.jones@email.com",
    image: ProfileImage,
    total: 2500,
  },
  {
    id: 6,
    name: "William Taylor",
    email: "william.taylor@email.com",
    image: ProfileImage,
    total: 4500,
  },
  {
    id: 7,
    name: "Isabella Johnson",
    email: "isabella.johnson@email.com",
    image: ProfileImage,
    total: 5300,
  },
];

export const topProducts = [
  {
    number: 1,
    name: "Wireless Headphones",
    image: ProductImage,
    description: "High-quality noise-canceling wireless headphones.",
    price: 99.99,
    status: "In Stock",
    rating: 4.5,
  },
  {
    number: 2,
    name: "Smartphone",
    image: ProductImage,
    description: "Latest 5G smartphone with excellent camera features.",
    price: 799.99,
    status: "In Stock",
    rating: 4.7,
  },
  {
    number: 3,
    name: "Gaming Laptop",
    image: ProductImage,
    description: "Powerful gaming laptop with high-end graphics.",
    price: 1299.99,
    status: "In Stock",
    rating: 4.8,
  },
  {
    number: 4,
    name: "Smartwatch",
    image: ProductImage,
    description: "Stylish smartwatch with fitness tracking features.",
    price: 199.99,
    status: "Out of Stock",
    rating: 4.4,
  },
  {
    number: 5,
    name: "Bluetooth Speaker",
    image: ProductImage,
    description: "Portable Bluetooth speaker with deep bass sound.",
    price: 59.99,
    status: "In Stock",
    rating: 4.3,
  },
  {
    number: 6,
    name: "4K Monitor",
    image: ProductImage,
    description: "Ultra HD 4K monitor with stunning color accuracy.",
    price: 399.99,
    status: "In Stock",
    rating: 4.6,
  },
  {
    number: 7,
    name: "Mechanical Keyboard",
    image: ProductImage,
    description: "Mechanical keyboard with customizable RGB lighting.",
    price: 89.99,
    status: "In Stock",
    rating: 4.7,
  },
  {
    number: 8,
    name: "Wireless Mouse",
    image: ProductImage,
    description: "Ergonomic wireless mouse with precision tracking.",
    price: 49.99,
    status: "In Stock",
    rating: 4.5,
  },
  {
    number: 9,
    name: "Action Camera",
    image: ProductImage,
    description: "Waterproof action camera with 4K video recording.",
    price: 249.99,
    status: "In Stock",
    rating: 4.8,
  },
  {
    number: 10,
    name: "External Hard Drive",
    image: ProductImage,
    description: "Portable 2TB external hard drive for data storage.",
    price: 79.99,
    status: "Out of Stock",
    rating: 4.5,
  },
];
