import AuthLayout from "../layouts/AuthLayout";
import Login from "../features/auth/Login";
import Signup from "../features/auth/Signup";
import ForgotPassword from "../features/auth/ForgotPassword";

const authRoutes = [
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
];

export default authRoutes;
