import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/ui/Loader";
import { usePageTitle } from "../hooks/usePageTitle";
import { authRoutes } from "./authRoutes";

function AuthProtectedRoute({ children }) {
  const { user } = useAuth();

  usePageTitle("auth", authRoutes);

  if (user === undefined) return <Loader />;

  return user ? <Navigate to="/dashboard/overview" replace /> : children;
}

export default AuthProtectedRoute;
