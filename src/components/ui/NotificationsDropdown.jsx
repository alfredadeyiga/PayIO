import { MdClose, MdKeyboardArrowDown } from "react-icons/md";
import { useNotifications } from "../../hooks/features/notifications/useNotifications";
import { useMarkNotification } from "../../hooks/features/notifications/useMarkNotification";

import Loader from "./Loader";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

function NotificationsDropdown({ onClose }) {
  const [openId, setOpenId] = useState(null);

  const { data: notifications, isLoading } = useNotifications();

  const { mutate: markAsRead } = useMarkNotification();

  function toggleOpen(id) {
    const notification = notifications?.find((notif) => notif.id === id);

    if (!notification?.is_read) {
      markAsRead(id);
    }
    setOpenId((prev) => (prev === id ? null : id));
  }

  const formatTime = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute top-full -translate-x-[220px] md:-translate-x-1/2 mt-4 w-[280px] md:w-[320px] bg-white rounded-md shadow-lg border border-previous/25 z-50 overflow-hidden"
    >
      <div className="p-4 border-b border-previous/25 flex items-center justify-between font-semibold text-black">
        <h2>Notifications</h2>

        <button type="button" onClick={onClose} className="cursor-pointer">
          <MdClose className="text-black" />
        </button>
      </div>

      <div className="max-h-[200px] flex flex-col gap-1 overflow-y-auto custom-scrollbar">
        {isLoading && (
          <div className="py-4">
            <Loader variant="button" />
          </div>
        )}

        {notifications?.length === 0 ? (
          <p className="p-4 text-sm text-card text-center">No notifications</p>
        ) : (
          notifications?.map((notif) => (
            <div
              key={notif.id}
              onClick={() => toggleOpen(notif.id)}
              className="relative pl-[38px] pr-4 py-3 cursor-pointer hover:bg-previous/20 transition-colors duration-300 ease-in-out"
            >
              <div className="flex justify-between items-center gap-3">
                <div className="flex flex-col gap-1">
                  <p
                    className={`text-sm text-black ${!notif.is_read && "font-semibold"}`}
                  >
                    {notif.message}
                  </p>

                  <p className="text-xs text-card">
                    {formatTime(notif.created_at)}
                  </p>

                  {openId === notif.id && (
                    <p className="text-xs text-notification mt-2">
                      {notif.description}
                    </p>
                  )}
                </div>

                <MdKeyboardArrowDown
                  className={`text-black transition shrink-0 ${openId === notif.id ? "rotate-180" : ""}`}
                />
              </div>

              {!notif.is_read && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-primary"></span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationsDropdown;
