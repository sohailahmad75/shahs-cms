import { Navigate, Outlet } from "react-router-dom";
import { useAdmin } from "../hooks/useAuth";

interface Props {
  allowedRoles: number[];
}

export default function ProtectedRoute({ allowedRoles }: Props) {
  const { admin: activeAdmin } = useAdmin();
  const isAuthenticated = !!activeAdmin.admin?.id || !!activeAdmin.admin?.email;
  const role = activeAdmin?.admin?.role;

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role || ""))
    return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}
