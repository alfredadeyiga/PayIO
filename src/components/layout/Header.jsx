import { IoSearch } from "react-icons/io5";
import { LuChevronsRight } from "react-icons/lu";
import { MdClose, MdNotifications } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import NotificationsDropdown from "../ui/NotificationsDropdown";
import { useRef, useState } from "react";
import useOutsideClick from "../../hooks/useOutsideClick";
import SearchDropdown from "../ui/SearchDropdown";
import { RiMenu3Fill } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/features/notifications/useNotifications";
import { useProfile } from "../../hooks/features/settings/useProfile";

function Header({ onToggleSidebar }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: notifications } = useNotifications();

  const unreadNotifs = notifications?.filter((notif) => !notif.is_read);

  const { data: profile } = useProfile();

  const firstName = profile?.first_name;

  const location = useLocation();

  const showFirstName = location.pathname.includes("overview");

  const notificationsRef = useRef();
  const resultsRef = useRef();

  useOutsideClick(notificationsRef, () => setShowNotifications(false));

  useOutsideClick(resultsRef, () => {
    setShowSearch(false);
    setSearchQuery(undefined);
  });

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="flex items-center justify-between gap-6 border-b border-header py-4 px-6 md:py-5 md:px-8 lg:pl-6">
      <div className="flex items-center gap-6">
        <button type="button" className="lg:hidden" onClick={onToggleSidebar}>
          <RiMenu3Fill className="w-6 h-6 text-date" />
        </button>

        <Link
          to="/dashboard/overview"
          className={`font-poppins font-bold text-3xl text-black lg:hidden ${showSearch && "hidden"}`}
        >
          <h2>
            Pay<span className="font-normal">IO</span>
          </h2>
        </Link>

        {showFirstName && (
          <p className="font-bold text-2xl text-black hidden lg:block">
            Hello {firstName}
          </p>
        )}

        <div className="hidden lg:flex items-center gap-1 text-sm text-date">
          <LuChevronsRight className="w-6 h-6" />
          {currentDate}
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div
          ref={notificationsRef}
          className={`relative md:block ${showSearch && "hidden"}`}
          onClick={() => setShowNotifications((prev) => !prev)}
        >
          <button type="button" className="relative flex">
            <MdNotifications className="w-6 h-6 cursor-pointer text-notification" />

            {unreadNotifs?.length !== 0 && (
              <span className="absolute w-2 h-2 top-0 right-0 mr-[2px] border border-white rounded-full bg-primary"></span>
            )}
          </button>

          {showNotifications && (
            <NotificationsDropdown
              onClose={() => setShowNotifications(false)}
            />
          )}
        </div>

        <button
          type="button"
          className={`md:hidden flex ${showSearch && "hidden"}`}
          onClick={(e) => {
            e.stopPropagation();
            setShowSearch(true);
          }}
        >
          <IoSearch className="w-6 h-6 text-search" />
        </button>

        <div
          ref={resultsRef}
          className={`relative shadow-[0px_26px_26px_rgba(106,22,58,0.04)] md:block ${!showSearch && "hidden"}`}
        >
          <input
            type="text"
            value={searchQuery}
            placeholder="Search transactions"
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={(e) => setSearchQuery(e.target.value)}
            className="bg-white pl-6 py-3 pr-14 w-full min-w-0 truncate rounded-xl placeholder-date text-outline"
          />

          <IoSearch className="absolute w-6 h-6 top-1/2 -translate-y-1/2 right-6 text-search" />

          {searchQuery && (
            <SearchDropdown
              query={searchQuery}
              onSelect={() => setSearchQuery("")}
            />
          )}
        </div>
      </div>

      <MdClose
        className={`w-6 h-6 text-search md:hidden ${!showSearch && "hidden"}`}
      />
    </header>
  );
}

export default Header;
