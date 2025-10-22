import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import { ROLES } from "../helper";
import ProductListPage from "../features/sales/products";
import ProductCategoryListPage from "../features/sales/productCategories/ProductCategoryListPage";
import ProductsWrapper from "../features/sales/products/ProductsWrapper";
import StoreOrdersListPage from "../features/sales/storeOrders/StoreOrdersListPage";
import SupplierListPage from "../features/sales/supplier/SupplierListPage";
import SupplierLayout from "../features/sales/supplier/components/SupplierLayout";
import SupplierInformation from "../features/sales/supplier/components/SupplierInformation";
import { Outlet } from "react-router-dom";
import ProductLayout from "../features/sales/products/components/ProductLayout";
import ProductInformation from "../features/sales/products/components/ProductInformation";

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
          { path: "store-orders", element: <StoreOrdersListPage /> },
          { path: "suppliers", element: <SupplierListPage /> },

          {
            path: "suppliers/:id",
            element: (
              <SupplierLayout />
            ),
            children: [
              {
                index: true,
                element: <SupplierInformation />,
              },
            ],
          },
          {
            path: "products/:id",
            element: (
              <ProductLayout />
            ),
            children: [
              {
                index: true,
                element: <ProductInformation />,
              },
            ],
          },
        ],
      },
    ],
  },
];

export default salesRoutes;