import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../hooks/useAuth";

interface Props {
  allowedRoles: string[];
}

export default function ProtectedRoute({ allowedRoles }: Props) {
  const { user: activeUser } = useUser();
  const isAuthenticated = !!activeUser.user?.id || !!activeUser.user?.email; // safer
  const role = activeUser?.user?.role;

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role || ""))
    return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}
