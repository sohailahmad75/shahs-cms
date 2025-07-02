// src/routes/index.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import authRoutes from "./authRoutes";
import dashboardRoutes from "./dashboardRoutes";
import transactionsRoutes from "./transactionsRoutes";
import reportRoutes from "./reportRoutes";
import invoiceRoutes from "./invoiceRoutes";
import menuManagerRoutes from "./menuManagerRoutes";

const router = createBrowserRouter([
  ...authRoutes,
  ...dashboardRoutes,
  ...transactionsRoutes,
  ...reportRoutes,
  ...invoiceRoutes,
  ...menuManagerRoutes,
  {
    path: "*",
    element: <Navigate to="/dashboard" />,
  },
]);

export default router;
