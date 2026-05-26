import { Bell, Trash2, CheckCircle, AlertCircle, Clock, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getSystemLogs } from '../../../common/utils/systemLogger.js';

export default function AdminNotifications({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    // Convert system logs to notifications
    const systemLogs = getSystemLogs();
    const formattedNotifications = systemLogs.map((log, index) => ({
      id: log.id,
      title: getNotificationTitle(log.action),
      message: log.description,
      actor: log.actorName,
      role: log.actorRole,
      timestamp: new Date(log.createdAt),
      action: log.action,
      read: index > 2, // First 3 are unread
      type: getNotificationType(log.action),
    }));
    setNotifications(formattedNotifications);
  }, [isOpen]);

  const getNotificationTitle = (action) => {
    const titles = {
      TIME_IN: 'Intern Timed In',
      TIME_OUT: 'Intern Timed Out',
      TASK_ASSIGNED: 'New Task Assigned',
      DOCUMENT_SUBMITTED: 'Document Submitted',
      ATTENDANCE_REQUEST: 'Attendance Request',
      DOCUMENT_REQUEST: 'Document Request',
      EVALUATION_COMPLETED: 'Evaluation Completed',
      APPLICATION_SUBMITTED: 'New Application',
      DTR_SUBMITTED: 'DTR Submitted',
      NEW_UNIVERSITY: 'New Partner University',
      NEW_INTERN: 'New Intern',
      INTERN_COMPLETED: 'Completed Intern',
      MOA_UPLOADED: 'MOA Uploaded',
      MOA_EXPIRING: 'MOA Expiring Soon',
      LOGIN: 'User Logged In',
      LOGOUT: 'User Logged Out',
    };
    return titles[action] || 'System Activity';
  };

  const getNotificationType = (action) => {
    if (
      action === 'DOCUMENT_SUBMITTED' ||
      action === 'EVALUATION_COMPLETED' ||
      action === 'APPLICATION_SUBMITTED' ||
      action === 'NEW_UNIVERSITY' ||
      action === 'NEW_INTERN' ||
      action === 'INTERN_COMPLETED' ||
      action === 'MOA_UPLOADED'
    ) {
      return 'success';
    }
    if (
      action === 'ATTENDANCE_REQUEST' ||
      action === 'DOCUMENT_REQUEST' ||
      action === 'MOA_EXPIRING'
    ) {
      return 'warning';
    }
    return 'info';
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'warning':
        return <AlertCircle className="text-yellow-500" size={20} />;
      case 'info':
        return <Clock className="text-blue-500" size={20} />;
      default:
        return <Bell className="text-slate-500" size={20} />;
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Drawer */}
      <div className="fixed right-0 top-0 z-50 h-screen w-full max-w-2xl transform overflow-hidden rounded-l-3xl bg-white shadow-2xl transition-transform duration-300 ease-out">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Notifications
              </h1>
              <p className="text-sm text-slate-500">
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Filter Tabs */}
            <div className="border-b border-slate-200 px-6">
              <div className="flex gap-3">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-3 font-medium transition ${
                    filter === 'all'
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-4 py-3 font-medium transition ${
                    filter === 'unread'
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter('read')}
                  className={`px-4 py-3 font-medium transition ${
                    filter === 'read'
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Read ({notifications.filter((n) => n.read).length})
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-3 p-6">{filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 rounded-2xl border p-4 transition ${
                    notification.read
                      ? 'border-slate-200 bg-white'
                      : 'border-indigo-200 bg-indigo-50'
                  }`}
                >
                  <div className="flex-shrink-0 pt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {notification.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {notification.message}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="font-medium">{notification.actor}</span>
                          <span className="rounded-full bg-slate-100 px-2 py-1">
                            {notification.role}
                          </span>
                          <span>
                            {notification.timestamp.toLocaleString()}
                          </span>
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
                        onClick={() => markAsRead(notification.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
                        title="Mark as read"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-100 hover:text-red-600 transition"
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
            )}</div>
          </div>

          {/* Footer */}
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
