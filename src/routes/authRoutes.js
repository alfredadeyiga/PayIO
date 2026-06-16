import ForgotPassword from "../pages/auth/ForgotPassword";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

export const authRoutes = [
  {
    path: "login",
    element: Login,
    title: "Login",
  },
  {
    path: "signup",
    element: Signup,
    title: "Signup",
  },
  {
    path: "forgot-password",
    element: ForgotPassword,
    title: "Forgot Password",
  },
];
