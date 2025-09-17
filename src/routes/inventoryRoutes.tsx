// src/routes/inventoryRoutes.tsx
import { Outlet } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import { ROLES } from "../helper";
import ProductListPage from "../features/inventory/products";
import ProductCategoryListPage from "../features/inventory/productCategories/ProductCategoryListPage";

const inventoryRoutes = [
  {
    element: <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]} />,
    children: [
      {
        path: "/inventory",
        element: (
          <MainLayout>
            <Outlet />
          </MainLayout>
        ),
        children: [
          { index: true, element: <ProductListPage /> },
          { path: "products", element: <ProductListPage /> },
          { path: "product-categories", element: <ProductCategoryListPage /> },
        ],
      },
    ],
  },
];

export default inventoryRoutes;
