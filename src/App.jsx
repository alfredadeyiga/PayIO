import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import NotFound from "./pages/NotFound";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import { dashboardRoutes } from "./routes/dashboardRoutes";
import { authRoutes } from "./routes/authRoutes";
import { ModalProvider } from "./context/ModalContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthProtectedRoute from "./routes/AuthProtectedRoute";
import RealtimeProvider from "./providers/RealtimeProvider";
import ResetPassword from "./pages/auth/ResetPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard/overview" replace />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="overview" replace />,
      },

      ...dashboardRoutes.map((route) => {
        const Component = route.element;

        return {
          path: route.path,
          element: <Component />,
        };
      }),
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="login" replace />,
      },

      ...authRoutes.map((route) => {
        const Component = route.element;

        return {
          path: route.path,
          element: (
            <AuthProtectedRoute>
              <Component />
            </AuthProtectedRoute>
          ),
        };
      }),

      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "/not-found",
    element: <NotFound />,
  },
  {
    path: "*",
    element: <Navigate to="/not-found" replace />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <RealtimeProvider>
        <ModalProvider>
          <RouterProvider router={router} />
        </ModalProvider>
      </RealtimeProvider>
    </AuthProvider>
  );
}

export default App;
