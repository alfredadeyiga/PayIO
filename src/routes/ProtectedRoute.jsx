import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/ui/Loader";

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (user === undefined) return <Loader />;

  return !user ? <Navigate to="/auth/login" replace /> : children;
}

export default ProtectedRoute;
