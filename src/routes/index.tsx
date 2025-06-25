// src/routes/index.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../features/auth/Login";
import Dashboard from "../features/dashboard";
import ListReports from "../features/dailyReports/ListReports";
import ReportDetails from "../features/dailyReports/ReportDetails";
import CreateReport from "../features/dailyReports/CreateReport";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import Signup from "../features/auth/Signup";
import ForgotPassword from "../features/auth/ForgotPassword";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
  },
  {
    path: "/signup",
    element: (
      <AuthLayout>
        <Signup />
      </AuthLayout>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <AuthLayout>
        <ForgotPassword />
      </AuthLayout>
    ),
  },
  {
    element: (
      <ProtectedRoute
        allowedRoles={["admin", "superadmin", "shop-owner", "manager"]}
      />
    ),
    children: [
      {
        path: "/dashboard",
        element: (
          <MainLayout>
            <Dashboard />
          </MainLayout>
        ),
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["admin", "superadmin"]} />,
    children: [
      {
        path: "/reports",
        element: (
          <MainLayout>
            <ListReports />
          </MainLayout>
        ),
      },
      {
        path: "/reports/create",
        element: (
          <MainLayout>
            <CreateReport />
          </MainLayout>
        ),
      },
      {
        path: "/reports/:id",
        element: (
          <MainLayout>
            <ReportDetails />
          </MainLayout>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" />,
  },
]);

export default router;
