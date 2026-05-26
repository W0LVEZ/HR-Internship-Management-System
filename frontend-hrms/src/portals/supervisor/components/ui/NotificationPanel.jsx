import { useEffect, useMemo, useState } from "react";
import { Bell, X } from "lucide-react";
import NotificationItem from "../../../../common/components/ui/NotificationItem";

const TABS = [
  { id: "all", label: "All" },
  { id: "read", label: "Read" },
  { id: "unread", label: "Unread" },
];

// Single test notification (All tab only) — remove when connecting to real data
const TEST_NOTIFICATION = {
  id: 1,
  title: "Notification 1",
  message: "Action",
  time: "Just now",
  status: "unread",
};

/**
 * Supervisor notification system: bell trigger + right side panel.
 * Notifications shape: { id, title, message, time, status: "read" | "unread" }
 */
export default function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter((n) => n.status === "unread").length;
  const readCount = notifications.filter((n) => n.status === "read").length;

  const tabCounts = {
    all: notifications.length + 1,
    read: readCount,
    unread: unreadCount,
  };

  const filteredNotifications = useMemo(() => {
    if (activeTab === "unread") {
      return notifications.filter((n) => n.status === "unread");
    }
    if (activeTab === "read") {
      return notifications.filter((n) => n.status === "read");
    }
    return [TEST_NOTIFICATION, ...notifications];
  }, [activeTab, notifications]);

  const isEmpty = filteredNotifications.length === 0;

  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (e) => {
      if (e.key === "Escape") handleClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open notifications"
        aria-expanded={isOpen}
        className="rounded-xl bg-gray-100 p-3 transition-colors hover:bg-gray-300"
      >
        <Bell size={18} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close notifications"
            className="absolute inset-0 bg-black/20 backdrop-blur-md transition-opacity"
            onClick={handleClose}
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="supervisor-notifications-title"
            className="relative flex h-full w-full max-w-full flex-col rounded-l-2xl bg-white shadow-2xl sm:max-w-sm sm:rounded-l-3xl md:max-w-md lg:w-[30%] lg:max-w-lg"
          >
            <div className="flex shrink-0 items-start justify-between px-5 py-5 sm:px-6">
              <div>
                <h2
                  id="supervisor-notifications-title"
                  className="text-lg font-bold text-gray-900 sm:text-xl"
                >
                  Notifications
                </h2>
                <p className="mt-0.5 text-xs text-gray-400 sm:text-sm">
                  You have 0 notifications today
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} strokeWidth={1.75} />
              </button>
            </div>

            <div className="shrink-0 border-b border-gray-100 px-5 sm:px-6">
              <div className="flex gap-4 sm:gap-6">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative pb-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "text-[#7C3EFF]"
                          : "text-gray-900 hover:text-gray-700"
                      }`}
                    >
                      {tab.label} ({tabCounts[tab.id]})
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#7C3EFF]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col px-5 pb-5 sm:px-6 sm:pb-6">
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
                {isEmpty ? (
                  <div className="flex flex-1 items-center justify-center px-6 py-16">
                    <p className="text-center text-sm text-gray-400">
                      You have no notifications yet
                    </p>
                  </div>
                ) : (
                  <div className="min-h-0 flex-1 overflow-y-auto">
                    {filteredNotifications.map((notif) => (
                      <NotificationItem
                        key={notif.id}
                        title={notif.title}
                        message={notif.message}
                        time={notif.time}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
