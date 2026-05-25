export const LOG_TYPES = {
  TIME_IN: "TIME_IN",
  TIME_OUT: "TIME_OUT",
  TASK_ASSIGNED: "TASK_ASSIGNED",
  TASK_SUBMITTED: "TASK_SUBMITTED",
  TASK_COMPLETED: "TASK_COMPLETED",
  INTERN_EMPLOYED: "INTERN_EMPLOYED",
  INTERN_ASSIGNED_SUPERVISOR: "INTERN_ASSIGNED_SUPERVISOR",
  DOCUMENT_SUBMITTED: "DOCUMENT_SUBMITTED",
  ATTENDANCE_REQUEST: "ATTENDANCE_REQUEST",
  DOCUMENT_REQUEST: "DOCUMENT_REQUEST",
  EVALUATION_COMPLETED: "EVALUATION_COMPLETED",
  APPLICATION_SUBMITTED: "APPLICATION_SUBMITTED",
  DTR_SUBMITTED: "DTR_SUBMITTED",
  MOA_UPLOADED: "MOA_UPLOADED",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
};

export const sampleSystemLogs = [
  {
    id: "sample-time-in",
    createdAt: "2026-05-14T00:10:00.000Z",
    action: LOG_TYPES.TIME_IN,
    type: LOG_TYPES.TIME_IN,
    title: "Intern Timed In",
    description: "Alex Santos timed in at 09:10 AM.",
    actorId: "intern_it",
    actorName: "Alex Santos",
    actorRole: "INTERN",
    audience: ["hr-admin"],
    supervisorId: "supervisor_it",
    internId: "intern_it",
    metadata: {},
  },
  {
    id: "sample-time-out",
    createdAt: "2026-05-14T09:05:00.000Z",
    action: LOG_TYPES.TIME_OUT,
    type: LOG_TYPES.TIME_OUT,
    title: "Intern Timed Out",
    description: "Alex Santos timed out at 06:05 PM.",
    actorId: "intern_it",
    actorName: "Alex Santos",
    actorRole: "INTERN",
    audience: ["hr-admin"],
    supervisorId: "supervisor_it",
    internId: "intern_it",
    metadata: {},
  },
  {
    id: "sample-task-assigned",
    createdAt: "2026-05-14T01:20:00.000Z",
    action: LOG_TYPES.TASK_ASSIGNED,
    type: LOG_TYPES.TASK_ASSIGNED,
    title: "New Task Assigned",
    description: 'Sarah Richards assigned "Landing Page QA" to Alex Santos.',
    actorId: "supervisor_it",
    actorName: "Sarah Richards (IT Supervisor)",
    actorRole: "SUPERVISOR",
    audience: ["hr-admin", "intern"],
    supervisorId: "supervisor_it",
    internId: "intern_it",
    metadata: {
      taskId: "sample-task-landing-qa",
      deadline: "2026-05-20",
    },
  },
  {
    id: "sample-intern-employed",
    createdAt: "2026-05-14T02:10:00.000Z",
    action: LOG_TYPES.INTERN_EMPLOYED,
    type: LOG_TYPES.INTERN_EMPLOYED,
    title: "New Intern Employed",
    description: "Alex Santos has been deployed as an employed intern.",
    actorId: "admin_system",
    actorName: "Elena (HR Admin)",
    actorRole: "ADMIN",
    audience: ["hr-admin", "hr-staff"],
    supervisorId: "supervisor_it",
    internId: "intern_it",
    metadata: {},
  },
  {
    id: "sample-intern-assigned-supervisor",
    createdAt: "2026-05-14T02:15:00.000Z",
    action: LOG_TYPES.INTERN_ASSIGNED_SUPERVISOR,
    type: LOG_TYPES.INTERN_ASSIGNED_SUPERVISOR,
    title: "Intern Assigned to Supervisor",
    description: "Alex Santos was assigned to Sarah Richards (IT Supervisor).",
    actorId: "admin_system",
    actorName: "Elena (HR Admin)",
    actorRole: "ADMIN",
    audience: ["hr-admin", "hr-staff", "supervisor", "intern"],
    supervisorId: "supervisor_it",
    internId: "intern_it",
    metadata: {},
  },
  {
    id: "sample-task-submitted",
    createdAt: "2026-05-14T06:30:00.000Z",
    action: LOG_TYPES.TASK_SUBMITTED,
    type: LOG_TYPES.TASK_SUBMITTED,
    title: "Task Finished",
    description: 'Alex Santos submitted "Landing Page QA".',
    actorId: "intern_it",
    actorName: "Alex Santos",
    actorRole: "INTERN",
    audience: ["hr-admin", "supervisor"],
    supervisorId: "supervisor_it",
    internId: "intern_it",
    metadata: {
      taskId: "sample-task-landing-qa",
      deliverable: "landing-page-qa.pdf",
    },
  },
  {
    id: "sample-evaluation-completed",
    createdAt: "2026-05-14T07:45:00.000Z",
    action: LOG_TYPES.EVALUATION_COMPLETED,
    type: LOG_TYPES.EVALUATION_COMPLETED,
    title: "Evaluation Completed",
    description: "Sarah Richards completed an evaluation for Alex Santos.",
    actorId: "supervisor_it",
    actorName: "Sarah Richards (IT Supervisor)",
    actorRole: "SUPERVISOR",
    audience: ["hr-admin", "supervisor", "intern"],
    supervisorId: "supervisor_it",
    internId: "intern_it",
    metadata: {
      evaluationId: "sample-evaluation-alex",
    },
  },
];

export const addSystemLog = (log) => {
  const existingLogs =
    JSON.parse(localStorage.getItem("hrims_system_logs")) || [];

  const newLog = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    action: log.action || log.type || "SYSTEM_ACTIVITY",
    type: log.type || log.action || "SYSTEM_ACTIVITY",
    title: log.title || "System Activity",
    description: log.description || "A system activity was recorded.",

    //Who did the action
    actorId: log.actorId || null,
    actorName: log.actorName || "Unknown",
    actorRole: log.actorRole || "Unknown",

    //Who should see it in the recent activity
    audience: log.audience || [],

    //optional relationships
    supervisorId: log.supervisorId || null,
    internId: log.internId || null,

    //Extra details if needed
    metadata: log.metadata || {},
  };

  localStorage.setItem(
    "hrims_system_logs",
    JSON.stringify([newLog, ...existingLogs]),
  );
};

export const getSystemLogs = () => {
  const storedLogs = JSON.parse(localStorage.getItem("hrims_system_logs")) || [];

  return storedLogs.length > 0 ? storedLogs : sampleSystemLogs;
};
