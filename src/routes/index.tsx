// src/routes/index.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import authRoutes from "./authRoutes";
import dashboardRoutes from "./dashboardRoutes";
import transactionsRoutes from "./transactionsRoutes";
import reportRoutes from "./reportRoutes";

const router = createBrowserRouter([
  ...authRoutes,
  ...dashboardRoutes,
  ...transactionsRoutes,
  ...reportRoutes,
  {
    path: "*",
    element: <Navigate to="/dashboard" />,
  },
]);

export default router;
