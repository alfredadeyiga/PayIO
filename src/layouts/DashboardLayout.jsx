import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { dashboardRoutes } from "../routes/dashboardRoutes";
import { usePageTitle } from "../hooks/usePageTitle";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { useModal } from "../context/ModalContext";
import Modal from "../components/ui/Modal";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { isOpen } = useModal();

  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  usePageTitle("dashboard", dashboardRoutes);

  return (
    <div className="relative flex h-[100dvh]">
      <div
        className={`bg-black/15 absolute inset-0 z-30 lg:bg-none lg:relative transition-transform duration-300 ease-in-out -translate-x-full lg:translate-x-0 ${sidebarOpen && "translate-x-0"}`}
        onClick={() => setSidebarOpen(false)}
      >
        <Sidebar onCloseSidebar={() => setSidebarOpen(false)} />
      </div>

      <main className="flex flex-col flex-1">
        <Header onToggleSidebar={() => setSidebarOpen(true)} />

        <div className="p-6 pt-4 md:pb-8 md:px-8 lg:pl-6 overflow-y-auto flex-1">
          <Outlet />
        </div>
      </main>

      <ToastContainer position="top-center" autoClose={3000} />

      {isOpen && <Modal />}
    </div>
  );
}

export default DashboardLayout;
