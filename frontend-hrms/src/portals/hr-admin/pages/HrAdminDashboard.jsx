import { Bell, BriefcaseBusiness, CheckCheck, ChevronDown, ClipboardList, Plus, SunMedium, Users, University } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  getHrAdminDashboardMetrics,
  getHrAdminRecentActivities,
  hrAdminDashboardData,
} from '../../../common/utils/mockAuth.js';
import { useAuth } from '../../../contexts/AuthContext.jsx';

const metricIcons = {
  'Total Interns': Users,
  'Completed Interns': CheckCheck,
  'Active Interns': ClipboardList,
  'Partner Universities': University,
};

export default function HRAdminDashboard() {
  const { currentUser } = useAuth();
  const [selectedAction, setSelectedAction] = useState('');
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [metrics, setMetrics] = useState(() => getHrAdminDashboardMetrics());
  const [recentActivity, setRecentActivity] = useState(() =>
    getHrAdminRecentActivities(),
  );
  const dashboard = { ...hrAdminDashboardData, metrics, recentActivity };
  const displayName = currentUser?.name || dashboard.greeting.name;
  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date()),
    [],
  );

  const handleQuickActionClick = (actionId) => {
    setSelectedAction(actionId);
    setIsQuickActionOpen(false);
  };

  useEffect(() => {
    setMetrics(getHrAdminDashboardMetrics());
    setRecentActivity(getHrAdminRecentActivities());
  }, []);

  return (
    <div className="space-y-6">
      {/**<div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50">
          <Bell size={18} />
        </button>
      </div>**/}

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
          <div className="rounded-3xl border border-slate-200 p-4" style={{backgroundColor: '#be94d625'}}>
            <div className="mb-6 flex items-start gap-3">
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-500">
                <SunMedium size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  Hello {displayName}
                </h1>
                <p className="text-sm font-semibold text-slate-800">{dashboard.greeting.message}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-bold text-slate-900">{dashboard.greeting.dateLabel}</p>
              <p className="text-base font-bold text-slate-900">{todayLabel}</p>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsQuickActionOpen((open) => !open)}
                className="flex h-11 w-full items-center justify-between rounded-2xl bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
              >
                <span>Quick Action</span>
                <ChevronDown size={16} className={`transition ${isQuickActionOpen ? 'rotate-180' : ''}`} />
              </button>

              {isQuickActionOpen && (
                <div className="absolute left-0 top-[calc(100%+8px)] z-10 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  {dashboard.quickActions.map((action) => (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => handleQuickActionClick(action.id)}
                      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition hover:bg-slate-50 ${
                        selectedAction === action.id ? 'text-indigo-600' : 'text-slate-600'
                      }`}
                    >
                      {action.id === 'add_intern' ? <Plus size={14} /> : <BriefcaseBusiness size={14} />}
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {dashboard.metrics.map((metric) => {
              const Icon = metricIcons[metric.title] ?? Users;
              const isPositive = metric.trendType === 'up';

              return (
                <div key={metric.title} className="rounded-3xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50 text-violet-500">
                        <Icon size={15} />
                      </span>
                      {metric.title}
                    </div>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ${
                        isPositive ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'
                      }`}
                    >
                      {isPositive ? '+' : '-'} {metric.trend}
                    </span>
                  </div>
                  <p className="text-4xl font-semibold leading-none text-slate-900">{metric.value}</p>
                  <p className="mt-4 text-xs text-slate-400">Updated: March 28, 2026</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.2fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold text-slate-900">Recent Activity</h2>
            <div className="mt-5 max-h-[320px] space-y-4 overflow-y-auto pr-2">
              {dashboard.recentActivity.length ? (
                dashboard.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <span className={`mt-1 h-5 w-5 rounded-full ${activity.color}`} />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{activity.label}</p>
                    <p className="text-xs text-slate-400">{activity.description}</p>
                  </div>
                </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">No recent activity yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-slate-900">Attendance Overview</h2>
              <button className="inline-flex h-8 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600">
                {dashboard.attendanceOverview.filterLabel}
                <ChevronDown size={14} />
              </button>
            </div>

            <div className="grid grid-cols-[30px_minmax(0,1fr)] gap-3">
              <div className="flex h-[250px] flex-col justify-between pb-8 text-[11px] text-slate-500">
                <span>100%</span>
                <span>80%</span>
                <span>60%</span>
                <span>40%</span>
                <span>20%</span>
                <span>0</span>
              </div>

              <div className="relative">
                <div className="absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between">
                  {[0, 1, 2, 3, 4].map((line) => (
                    <div key={line} className="border-t border-dashed border-slate-200/80" />
                  ))}
                </div>

                <div className="relative flex h-[250px] items-end justify-between gap-5">
                  {dashboard.attendanceOverview.days.map((item) => (
                    <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
                      <div className="flex h-[220px] w-3 items-end">
                        <div className="flex h-full w-full flex-col justify-end gap-1">
                          <div className="w-full rounded-full bg-rose-400" style={{ height: `${item.levels[2]}%` }} />
                          <div className="w-full rounded-full bg-amber-400" style={{ height: `${item.levels[1]}%` }} />
                          <div className="w-full rounded-full bg-violet-500" style={{ height: `${item.levels[0]}%` }} />
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-slate-500">{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
