// src/routes/salesRoutes.tsx
import { Outlet } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import { ROLES } from "../helper";
import ProductListPage from "../features/sales/products";
import ProductCategoryListPage from "../features/sales/productCategories/ProductCategoryListPage";
import ProductsWrapper from "../features/sales/products/ProductsWrapper";

const salesRoutes = [
  {
    element: <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]} />,
    children: [
      {
        path: "/sales",
        element: (
          <MainLayout>
            <ProductsWrapper>
              <Outlet />
            </ProductsWrapper>
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

export default salesRoutes;
