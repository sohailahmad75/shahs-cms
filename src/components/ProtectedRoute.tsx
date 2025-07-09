import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../hooks/useAuth";

interface Props {
  allowedRoles: number[];
}

export default function ProtectedRoute({ allowedRoles }: Props) {
  const { user: activeUser } = useUser();
  console.log("ProtectedRoute activeUser:", activeUser);
  const isAuthenticated = !!activeUser.user?.id || !!activeUser.user?.email;
  const role = activeUser?.user?.role;

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role || ""))
    return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}
