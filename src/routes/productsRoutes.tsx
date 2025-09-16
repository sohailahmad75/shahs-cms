import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import { ROLES } from "../helper";
import ProductForm from "../features/products";

const kioskRoutes = [
  {
    element: <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]} />,
    children: [
      {
        path: "/products/add",
        element: (
          <MainLayout>
            <ProductForm />
          </MainLayout>
        ),
      },
    ],
  },
];

export default kioskRoutes;
