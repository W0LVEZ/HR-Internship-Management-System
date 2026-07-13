import {
  Bell,
  BriefcaseBusiness,
  Building2,
  CheckCheck,
  ChevronDown,
  ClipboardList,
  LockKeyhole,
  Mail,
  Phone,
  Plus,
  ShieldCheck,
  SunMedium,
  University,
  UserCircle2,
  UserRoundPlus,
  Users,
  X,
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { hrAdminDashboardData } from '../../../common/utils/mockAuth.js';
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
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const formRefs = useRef({});
  const dashboard = hrAdminDashboardData;
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

    if (actionId === 'add_user') {
      setIsAddUserModalOpen(true);
    }
  };

  const resetAddUserForm = () => {
    const fields = ['firstName', 'middleName', 'lastName', 'email', 'contactNumber', 'username', 'password', 'confirmPassword', 'department'];
    fields.forEach((fieldName) => {
      const field = formRefs.current[fieldName];
      if (field) {
        field.value = '';
      }
    });

    const roleField = formRefs.current.role;
    if (roleField) {
      roleField.value = 'HR Staff';
    }

    const statusField = formRefs.current.status;
    if (statusField) {
      statusField.value = 'Active';
    }
  };

  const closeAddUserModal = () => {
    setIsAddUserModalOpen(false);
    setSelectedAction('');
    resetAddUserForm();
  };

  const handleCreateUser = (event) => {
    event.preventDefault();
    closeAddUserModal();
  };

  const FieldShell = ({ label, icon: Icon, optional = false, children, fieldId }) => (
    <div className="block">
      <label htmlFor={fieldId} className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Icon size={16} className="text-violet-500" />
        {label}
        {optional ? <span className="text-xs font-medium text-slate-400">(Optional)</span> : null}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/**<div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50">
          <Bell size={18} />
        </button>
      </div>**/}

      {isAddUserModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm"
          onClick={closeAddUserModal}
        >
          <div
            className="w-full max-w-3xl rounded-[28px] border border-violet-100 bg-white p-5 shadow-2xl shadow-violet-100/70 transition-all duration-300 sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-500">Quick Action</p>
                <h3 className="mt-1 text-2xl font-semibold text-slate-900">Add User</h3>
                <p className="mt-2 text-sm text-slate-500">Create a new HR staff or supervisor account with the required details.</p>
              </div>
              <button
                type="button"
                onClick={closeAddUserModal}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleCreateUser}>
              <div className="grid gap-4 md:grid-cols-2">
                <FieldShell label="First Name" icon={UserCircle2} fieldId="firstName">
                  <input
                    id="firstName"
                    name="firstName"
                    ref={(element) => {
                      formRefs.current.firstName = element;
                    }}
                    placeholder="Enter first name"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                    required
                  />
                </FieldShell>

                <FieldShell label="Middle Name" icon={UserCircle2} optional fieldId="middleName">
                  <input
                    id="middleName"
                    name="middleName"
                    ref={(element) => {
                      formRefs.current.middleName = element;
                    }}
                    placeholder="Optional"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                  />
                </FieldShell>

                <FieldShell label="Last Name" icon={UserCircle2} fieldId="lastName">
                  <input
                    id="lastName"
                    name="lastName"
                    ref={(element) => {
                      formRefs.current.lastName = element;
                    }}
                    placeholder="Enter last name"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                    required
                  />
                </FieldShell>

                <FieldShell label="Email Address" icon={Mail} fieldId="email">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    ref={(element) => {
                      formRefs.current.email = element;
                    }}
                    placeholder="name@company.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                    required
                  />
                </FieldShell>

                <FieldShell label="Contact Number" icon={Phone} fieldId="contactNumber">
                  <input
                    id="contactNumber"
                    name="contactNumber"
                    ref={(element) => {
                      formRefs.current.contactNumber = element;
                    }}
                    placeholder="09XX XXX XXXX"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                    required
                  />
                </FieldShell>

                <FieldShell label="Username" icon={UserCircle2} fieldId="username">
                  <input
                    id="username"
                    name="username"
                    ref={(element) => {
                      formRefs.current.username = element;
                    }}
                    placeholder="Choose a username"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                    required
                  />
                </FieldShell>

                <FieldShell label="Password" icon={LockKeyhole} fieldId="password">
                  <input
                    id="password"
                    type="password"
                    name="password"
                    ref={(element) => {
                      formRefs.current.password = element;
                    }}
                    placeholder="Create a strong password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                    required
                  />
                </FieldShell>

                <FieldShell label="Confirm Password" icon={LockKeyhole} fieldId="confirmPassword">
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    ref={(element) => {
                      formRefs.current.confirmPassword = element;
                    }}
                    placeholder="Re-enter password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                    required
                  />
                </FieldShell>

                <FieldShell label="Role" icon={ShieldCheck} fieldId="role">
                  <select
                    id="role"
                    name="role"
                    ref={(element) => {
                      formRefs.current.role = element;
                    }}
                    defaultValue="HR Staff"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                  >
                    <option>HR Staff</option>
                    <option>Supervisor</option>
                  </select>
                </FieldShell>

                <FieldShell label="Department" icon={Building2} optional fieldId="department">
                  <input
                    id="department"
                    name="department"
                    ref={(element) => {
                      formRefs.current.department = element;
                    }}
                    placeholder="Optional"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                  />
                </FieldShell>

                <FieldShell label="Status" icon={ShieldCheck} fieldId="status">
                  <select
                    id="status"
                    name="status"
                    ref={(element) => {
                      formRefs.current.status = element;
                    }}
                    defaultValue="Active"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </FieldShell>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeAddUserModal}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
          <div className="rounded-3xl border border-slate-200 p-4" style={{ backgroundColor: '#be94d625' }}>
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
                      {action.id === 'add_intern' ? <Plus size={14} /> : action.id === 'add_user' ? <UserRoundPlus size={14} /> : <BriefcaseBusiness size={14} />}
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
            <div className="mt-5 space-y-4">
              {dashboard.recentActivity.map((activity) => (
                <div key={activity.label} className="flex items-start gap-3">
                  <span className={`mt-1 h-5 w-5 rounded-full ${activity.color}`} />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{activity.label}</p>
                    <p className="text-xs text-slate-400">{activity.description}</p>
                  </div>
                </div>
              ))}
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