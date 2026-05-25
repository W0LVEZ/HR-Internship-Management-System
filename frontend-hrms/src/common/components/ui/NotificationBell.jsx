import { Bell } from "lucide-react";
import { useMemo, useState } from "react";
import Notifications from "./Notifications";
import { useAuth } from "../../../contexts/AuthContext";
import { getSystemLogs } from "../../utils/systemLogger";

export default function NotificationBell({ userRole = "intern" }) {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [systemLogs, setSystemLogs] = useState(() => getSystemLogs());

  const normalizeRole = (role) => {
    const value = String(role || "").toLowerCase().replace("_", "-");
    return value === "admin" ? "hr-admin" : value;
  };

  const role = normalizeRole(userRole || currentUser?.role);

  const visibleLogs = useMemo(() => {
    return systemLogs.filter((log) => {
      const action = log.action || log.type;

      if (role === "hr-admin") return true;
      if (role === "hr-staff") return true;

      if (role === "supervisor") {
        return (
          [
            "TASK_SUBMITTED",
            "TASK_COMPLETED",
            "EVALUATION_COMPLETED",
            "INTERN_ASSIGNED_SUPERVISOR",
          ].includes(action) &&
          (!log.supervisorId || log.supervisorId === currentUser?.id)
        );
      }

      if (role === "intern") {
        return (
          ["TASK_ASSIGNED", "INTERN_ASSIGNED_SUPERVISOR"].includes(action) &&
          (!log.internId || log.internId === currentUser?.id)
        );
      }

      return log.audience?.includes(role);
    });
  }, [currentUser?.id, role, systemLogs]);

  const readIds = JSON.parse(localStorage.getItem("hrims_notification_read_ids") || "[]");
  const deletedIds = JSON.parse(
    localStorage.getItem("hrims_notification_deleted_ids") || "[]",
  );
  const unreadCount = visibleLogs.filter(
    (log) => !readIds.includes(log.id) && !deletedIds.includes(log.id),
  ).length;
  const hasNotifications = unreadCount > 0;

  const handleOpen = () => {
    setSystemLogs(getSystemLogs());
    setIsOpen(true);
  };

  const handleClose = () => {
    setSystemLogs(getSystemLogs());
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="relative p-3 rounded-xl bg-gray-100 hover:bg-gray-300 transition-colors"
        title="Open notifications"
      >
        <Bell size={18} />
        {hasNotifications && (
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-600"></span>
        )}
      </button>

      <Notifications
        isOpen={isOpen}
        onClose={handleClose}
        userRole={role}
        systemLogs={systemLogs}
      />
    </>
  );
}
