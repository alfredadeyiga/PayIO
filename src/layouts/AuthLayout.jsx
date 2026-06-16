import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function AuthLayout() {
  return (
    <main className="flex flex-col min-h-[100dvh] gap-12 py-12 justify-center items-center">
      <h1 className="font-poppins font-bold text-4xl text-primary">
        Pay<span className="font-normal">IO</span>
      </h1>

      <Outlet />

      <ToastContainer autoClose={3000} />
    </main>
  );
}

export default AuthLayout;
