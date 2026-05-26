import { Bell } from "lucide-react";
import { useState } from "react";
import AdminNotifications from "../../../portals/hr-admin/pages/AdminNotifications";
import InternNotificationPanel from "../../../portals/interns/components/ui/NotificationPanel";
import SupervisorNotificationPanel from "../../../portals/supervisor/components/ui/NotificationPanel";
import { getSystemLogs } from "../../utils/systemLogger";

export default function NotificationBell({ userRole = "intern" }) {
  const [isOpen, setIsOpen] = useState(false);

  // Get unread notifications count from system logs
  const systemLogs = getSystemLogs();
  const unreadCount = systemLogs.filter((log, index) => index < 3).length; // First 3 are unread
  const hasNotifications = unreadCount > 0;

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  
  if (userRole === "hr-admin") {
    return (
      <>
        <button
          onClick={handleOpen}
          className="relative p-3 rounded-xl bg-gray-100 hover:bg-gray-300 transition-colors"
        >
          <Bell size={18} />

          {/* Notification Indicator */}
          {hasNotifications && (
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-600"></span>
          )}
        </button>

        <AdminNotifications isOpen={isOpen} onClose={handleClose} />
      </>
    );
  }

  if (userRole === "intern") {
    return <InternNotificationPanel />;
  }

  if (userRole === "supervisor") {
    return <SupervisorNotificationPanel />;
  }

  return (
    <button
      type="button"
      className="relative rounded-xl bg-gray-100 p-3 transition-colors hover:bg-gray-300"
    >
      <Bell size={18} />
      {hasNotifications && (
        <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-600" />
      )}
    </button>
  );
}
