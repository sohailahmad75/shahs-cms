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
import salesRoutes from "./salesRoutes";
import ordersRoutes from "./ordersRoutes";
import warehouseRoutes from "./warehouseRoutes";

const router = createBrowserRouter([
  ...authRoutes,
  ...dashboardRoutes,
  ...reportRoutes,
  ...invoiceRoutes,
  ...salesRoutes,
  ...menuManagerRoutes,
  ...storeRoutes,
  ...kioskRoutes,
  ...documentRoutes,
  ...usersRoutes,
  ...ordersRoutes,
  ...transactionsRoutes,
  ...warehouseRoutes,
  {
    path: "*",
    element: <Navigate to="/dashboard" />,
  },
]);

export default router;
