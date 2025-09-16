// src/routes/index.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import authRoutes from "./authRoutes";
import dashboardRoutes from "./dashboardRoutes";
import transactionsRoutes from "./transactionsRoutes";
import reportRoutes from "./reportRoutes";
import invoiceRoutes from "./invoiceRoutes";
import menuManagerRoutes from "./menuManagerRoutes";
import storeRoutes from "./storesRoutes";
import kioskRoutes from "./kioskRoutes";
import documentRoutes from "./documentTypeRoutes";
import usersRoutes from "./usersRoutes";
import productsRoutes from "./productsRoutes";

const router = createBrowserRouter([
  ...authRoutes,
  ...dashboardRoutes,
  ...transactionsRoutes,
  ...reportRoutes,
  ...invoiceRoutes,
  ...productsRoutes,
  ...menuManagerRoutes,
  ...storeRoutes,
  ...kioskRoutes,
  ...documentRoutes,
  ...usersRoutes,
  {
    path: "*",
    element: <Navigate to="/dashboard" />,
  },
]);

export default router;
