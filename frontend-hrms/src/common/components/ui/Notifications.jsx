import {
  AlertCircle,
  Bell,
  CheckCircle,
  ClipboardCheck,
  Clock,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { getSystemLogs, LOG_TYPES } from "../../utils/systemLogger.js";

const READ_KEY = "hrims_notification_read_ids";
const DELETED_KEY = "hrims_notification_deleted_ids";

const notificationTitles = {
  [LOG_TYPES.TIME_IN]: "Intern Timed In",
  [LOG_TYPES.TIME_OUT]: "Intern Timed Out",
  [LOG_TYPES.TASK_ASSIGNED]: "New Task Assigned",
  [LOG_TYPES.TASK_SUBMITTED]: "Task Finished",
  [LOG_TYPES.TASK_COMPLETED]: "Task Finished",
  [LOG_TYPES.INTERN_EMPLOYED]: "New Intern Employed",
  [LOG_TYPES.INTERN_ASSIGNED_SUPERVISOR]: "Intern Assigned to Supervisor",
  [LOG_TYPES.DOCUMENT_SUBMITTED]: "Document Submitted",
  [LOG_TYPES.ATTENDANCE_REQUEST]: "Attendance Request",
  [LOG_TYPES.DOCUMENT_REQUEST]: "Document Request",
  [LOG_TYPES.EVALUATION_COMPLETED]: "Evaluation Completed",
  [LOG_TYPES.APPLICATION_SUBMITTED]: "New Application",
  [LOG_TYPES.DTR_SUBMITTED]: "DTR Submitted",
  [LOG_TYPES.MOA_UPLOADED]: "MOA Uploaded",
  [LOG_TYPES.LOGIN]: "User Logged In",
  [LOG_TYPES.LOGOUT]: "User Logged Out",
};

const automaticActions = new Set([LOG_TYPES.TIME_IN, LOG_TYPES.TIME_OUT]);

const supervisorActions = new Set([
  LOG_TYPES.TASK_SUBMITTED,
  LOG_TYPES.TASK_COMPLETED,
  LOG_TYPES.EVALUATION_COMPLETED,
  LOG_TYPES.INTERN_ASSIGNED_SUPERVISOR,
]);

const internActions = new Set([
  LOG_TYPES.TASK_ASSIGNED,
  LOG_TYPES.INTERN_ASSIGNED_SUPERVISOR,
]);

const readStoredIds = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

const normalizeRole = (role) => {
  const value = String(role || "").toLowerCase().replace("_", "-");

  if (value === "admin") return "hr-admin";
  if (value === "hr-staff") return "hr-staff";
  if (value === "supervisor") return "supervisor";
  if (value === "intern") return "intern";

  return value;
};

const getNotificationType = (action) => {
  if (
    action === LOG_TYPES.DOCUMENT_SUBMITTED ||
    action === LOG_TYPES.EVALUATION_COMPLETED ||
    action === LOG_TYPES.APPLICATION_SUBMITTED ||
    action === LOG_TYPES.INTERN_EMPLOYED ||
    action === LOG_TYPES.INTERN_ASSIGNED_SUPERVISOR ||
    action === LOG_TYPES.TASK_SUBMITTED ||
    action === LOG_TYPES.TASK_COMPLETED
  ) {
    return "success";
  }

  if (
    action === LOG_TYPES.ATTENDANCE_REQUEST ||
    action === LOG_TYPES.DOCUMENT_REQUEST
  ) {
    return "warning";
  }

  return "info";
};

const getNotificationIcon = (notification) => {
  if (notification.action === LOG_TYPES.TASK_ASSIGNED) {
    return <ClipboardCheck className="text-indigo-500" size={20} />;
  }

  switch (notification.type) {
    case "success":
      return <CheckCircle className="text-green-500" size={20} />;
    case "warning":
      return <AlertCircle className="text-yellow-500" size={20} />;
    case "info":
      return <Clock className="text-blue-500" size={20} />;
    default:
      return <Bell className="text-slate-500" size={20} />;
  }
};

const getNotificationPath = (notification, role) => {
  if (notification.action === LOG_TYPES.TASK_ASSIGNED && role === "intern") {
    return "/intern/tasks";
  }

  if (
    notification.action === LOG_TYPES.INTERN_ASSIGNED_SUPERVISOR &&
    role === "supervisor"
  ) {
    return "/supervisor/myinterns";
  }

  if (
    notification.action === LOG_TYPES.INTERN_ASSIGNED_SUPERVISOR &&
    role === "intern"
  ) {
    return "/intern/profile";
  }

  if (
    (notification.action === LOG_TYPES.TASK_SUBMITTED ||
      notification.action === LOG_TYPES.TASK_COMPLETED) &&
    role === "supervisor" &&
    notification.internId
  ) {
    return `/supervisor/tasks/${notification.internId}`;
  }

  if (
    notification.action === LOG_TYPES.EVALUATION_COMPLETED &&
    role === "supervisor"
  ) {
    return "/supervisor/evaluations";
  }

  if (notification.action === LOG_TYPES.ATTENDANCE_REQUEST) {
    return role === "supervisor" ? "/supervisor/attendance" : null;
  }

  return null;
};

const canSeeNotification = (log, role, currentUser) => {
  if (role === "hr-admin") return true;
  if (role === "hr-staff") return true;

  const action = log.action || log.type;

  if (role === "supervisor") {
    return (
      supervisorActions.has(action) &&
      (!log.supervisorId || log.supervisorId === currentUser?.id)
    );
  }

  if (role === "intern") {
    return (
      internActions.has(action) && (!log.internId || log.internId === currentUser?.id)
    );
  }

  return log.audience?.includes(role);
};

export default function Notifications({
  isOpen,
  onClose,
  userRole,
  systemLogs = null,
}) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [readIds, setReadIds] = useState(() => readStoredIds(READ_KEY));
  const [deletedIds, setDeletedIds] = useState(() => readStoredIds(DELETED_KEY));
  const [filter, setFilter] = useState("all");

  const role = useMemo(
    () => normalizeRole(userRole || currentUser?.role),
    [currentUser?.role, userRole],
  );

  const notifications = useMemo(() => {
    const readIdSet = new Set(readIds);
    const deletedIdSet = new Set(deletedIds);
    const logs = systemLogs || getSystemLogs();

    return logs
      .filter((log) => log?.id && !deletedIdSet.has(log.id))
      .filter((log) => canSeeNotification(log, role, currentUser))
      .map((log) => {
        const action = log.action || log.type || "SYSTEM_ACTIVITY";

        return {
          id: log.id,
          title: log.title || notificationTitles[action] || "System Activity",
          message: log.description || "A system activity was recorded.",
          actor: log.actorName,
          role: log.actorRole,
          timestamp: new Date(log.createdAt),
          action,
          read: readIdSet.has(log.id),
          type: getNotificationType(action),
          internId: log.internId,
          supervisorId: log.supervisorId,
          isClickable: !automaticActions.has(action),
        };
      });
  }, [currentUser, deletedIds, readIds, role, systemLogs]);

  const persistIds = (key, ids) => {
    localStorage.setItem(key, JSON.stringify([...new Set(ids)]));
  };

  const markAsRead = (id) => {
    const nextReadIds = [...readIds, id];
    setReadIds(nextReadIds);
    persistIds(READ_KEY, nextReadIds);
  };

  const deleteNotification = (id) => {
    const nextDeletedIds = [...deletedIds, id];
    setDeletedIds(nextDeletedIds);
    persistIds(DELETED_KEY, nextDeletedIds);
  };

  const markAllAsRead = () => {
    const ids = notifications.map((notif) => notif.id);
    const nextReadIds = [...readIds, ...ids];
    setReadIds(nextReadIds);
    persistIds(READ_KEY, nextReadIds);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isClickable) return;

    markAsRead(notification.id);
    const path = getNotificationPath(notification, role);

    if (path) {
      onClose?.();
      navigate(path);
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.read;
    if (filter === "read") return notif.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 z-50 h-screen w-full max-w-2xl transform overflow-hidden rounded-l-3xl bg-white shadow-2xl transition-transform duration-300 ease-out">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Notifications
              </h1>
              <p className="text-sm text-slate-500">
                You have {unreadCount} unread notification
                {unreadCount !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              title="Close notifications"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="border-b border-slate-200 px-6">
              <div className="flex gap-3">
                {["all", "unread", "read"].map((tab) => {
                  const count =
                    tab === "all"
                      ? notifications.length
                      : notifications.filter((n) =>
                          tab === "unread" ? !n.read : n.read,
                        ).length;

                  return (
                    <button
                      key={tab}
                      onClick={() => setFilter(tab)}
                      className={`px-4 py-3 font-medium capitalize transition ${
                        filter === tab
                          ? "border-b-2 border-indigo-600 text-indigo-600"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {tab} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 p-6">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`flex items-start gap-4 rounded-2xl border p-4 transition ${
                      notification.read
                        ? "border-slate-200 bg-white"
                        : "border-indigo-200 bg-indigo-50"
                    } ${
                      notification.isClickable
                        ? "cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/80"
                        : "cursor-default"
                    }`}
                  >
                    <div className="flex-shrink-0 pt-1">
                      {getNotificationIcon(notification)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-slate-900">
                              {notification.title}
                            </h3>
                            {!notification.isClickable && (
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                                Auto
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-slate-600">
                            {notification.message}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="font-medium">
                              {notification.actor || "System"}
                            </span>
                            <span className="rounded-full bg-slate-100 px-2 py-1">
                              {notification.role || "System"}
                            </span>
                            <span>{notification.timestamp.toLocaleString()}</span>
                          </div>
                        </div>

                        {!notification.read && (
                          <div className="flex-shrink-0">
                            <div className="h-2 w-2 rounded-full bg-indigo-600" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-shrink-0 gap-2">
                      {!notification.read && (
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
                          title="Mark as read"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-100 hover:text-red-600"
                        title="Delete notification"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                  <Bell className="mx-auto mb-3 text-slate-300" size={48} />
                  <p className="text-slate-600">No notifications to show</p>
                </div>
              )}
            </div>
          </div>

          {unreadCount > 0 && (
            <div className="border-t border-slate-200 px-6 py-4">
              <button
                onClick={markAllAsRead}
                className="w-full rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Mark All as Read
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
