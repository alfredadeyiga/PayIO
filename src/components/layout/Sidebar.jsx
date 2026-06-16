import { Link, useLocation } from "react-router-dom";
import { CgLogOut } from "react-icons/cg";
import Profile from "../../assets/default-profile.png";
import Button from "../ui/Button";
import { dashboardRoutes } from "../../routes/dashboardRoutes";
import { useModal } from "../../context/ModalContext";
import { logout } from "../../api/auth";
import { toast } from "react-toastify";
import { useProfile } from "../../hooks/features/settings/useProfile";

function Sidebar({ onCloseSidebar }) {
  const { openModal, closeModal, setModalState } = useModal();

  const { data: profile } = useProfile();

  const fullName = `${profile?.first_name} ${profile?.last_name}`;

  const location = useLocation();

  const navItems = dashboardRoutes.filter(
    (route) => route.showInSidebar === true,
  );

  async function handleLogout() {
    setModalState({ isLoading: true });

    try {
      await logout();
    } catch (err) {
      toast.error(err.message);
    } finally {
      closeModal();
    }
  }

  return (
    <aside
      className="bg-secondary flex flex-col h-full py-7 md:py-12 px-6 md:px-7 w-[65vw] sm:w-[40vw] lg:w-[240px] 2xl:w-[20vw]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col gap-7 md:gap-10">
        <div className="flex items-center justify-center">
          <Link
            to="/dashboard/overview"
            className="font-poppins font-bold text-3xl text-white"
          >
            <h2>
              Pay<span className="font-normal">IO</span>
            </h2>
          </Link>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.includes(item.path);

            return (
              <Button
                key={item.title}
                variant="link"
                route={`/dashboard/${item.path}${item.defaultQuery || ""}`}
                className={`transition-colors duration-300 ease-in-out  ${
                  isActive
                    ? "bg-primary text-white"
                    : "hover:bg-white/8 text-white/70"
                }`}
              >
                <Icon className="w-6 h-6 shrink-0" />

                <span>{item.title}</span>
              </Button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-6 mt-auto">
        <Button
          type="button"
          variant="link"
          className="bg-white/8 font-medium text-white"
          onClick={() => {
            onCloseSidebar();
            openModal({
              type: "confirm",
              title: "Are you sure you want to logout?",
              onConfirm: handleLogout,
            });
          }}
        >
          <CgLogOut className="w-6 h-6 scale-x-[-1]" />

          <span>Logout</span>
        </Button>

        <div className="flex px-3 2xl:px-4 pt-6 border-t border-white/8">
          <Link
            to="/dashboard/settings?tab=security"
            className="flex gap-4 items-center w-full"
          >
            <img
              src={profile?.avatar || Profile}
              className="w-8 h-8 object-cover rounded-full shrink-0"
              alt="avatar"
            />

            <div className="min-w-0">
              <p className="font-medium text-white truncate">{fullName}</p>
              <p className="text-xs text-white/70">View Profile</p>
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
