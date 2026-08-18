import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { BsBell, BsChatDots, BsPeopleFill, BsPencilSquare } from "react-icons/bs";
import { formatDateTime } from "../../utils/helpers";
import useNotifications, { Notification } from "../../hooks/useNotifications";

const ICONS: Record<Notification["type"], React.ReactNode> = {
  NEW_CHAPTER: <BsPencilSquare />,
  NEW_COMMENT: <BsChatDots />,
  NEW_MESSAGE: <BsChatDots />,
  NEW_FOLLOWER: <BsPeopleFill />,
};

/** Where a notification takes you when you click it. */
const linkFor = (notification: Notification) => {
  if (notification.type === "NEW_CHAPTER" && notification.chapter_id) {
    return `/chapters/${notification.chapter_id}`;
  }
  if (notification.type === "NEW_MESSAGE") return "/messages";
  return notification.book_id ? `/books/${notification.book_id}` : "/tree";
};

const Notifications = () => {
  const { items, unread, isLoading, markRead, markAllRead } = useNotifications();

  return (
    <Menu as="div" className="relative">
      <MenuButton
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
        className="relative flex items-center rounded-full border border-black/20 p-2 transition-colors hover:bg-black hover:text-white">
        <BsBell className="text-lg" />
        {/* the old bell showed a hard-coded "2" */}
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-red-800 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        <MenuItems
          anchor="bottom end"
          className="z-50 mt-2 w-[min(92vw,22rem)] rounded-md border border-black/20 bg-[#dfd4bf] shadow-lg focus:outline-none">
          <div className="flex items-center justify-between border-b border-black/20 px-4 py-3">
            <p className="font-voyage text-lg uppercase">Notifications</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={() => markAllRead.mutate()}
                className="text-xs underline underline-offset-2 hover:no-underline">
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <p className="px-4 py-6 text-center text-sm text-black/50">Loading…</p>
            ) : items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-black/50">
                Nothing yet. Follow a book to hear about new chapters.
              </p>
            ) : (
              items.map((notification) => (
                <MenuItem key={notification.id}>
                  <Link
                    to={linkFor(notification)}
                    onClick={() => !notification.read && markRead.mutate(notification.id)}
                    className={`flex gap-3 border-b border-black/10 px-4 py-3 text-sm transition-colors hover:bg-black/5 ${
                      notification.read ? "opacity-60" : ""
                    }`}>
                    <span className="mt-0.5 shrink-0 text-base">
                      {ICONS[notification.type]}
                    </span>
                    <span className="min-w-0">
                      <span className="block break-words">{notification.message}</span>
                      <span className="mt-1 block text-xs text-black/50">
                        {formatDateTime(notification.created_at)}
                      </span>
                    </span>
                    {!notification.read && (
                      <span
                        aria-hidden
                        className="mt-1.5 size-2 shrink-0 rounded-full bg-red-800"
                      />
                    )}
                  </Link>
                </MenuItem>
              ))
            )}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export default Notifications;
