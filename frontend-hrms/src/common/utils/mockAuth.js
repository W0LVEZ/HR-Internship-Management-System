import { getSystemLogs, LOG_TYPES } from "./systemLogger.js";

const mockUsers = {
  // --- STAFF & ADMIN (Simple Data) ---
  admin_system: {
    id: "admin_system",
    name: "Elena (HR Admin)",
    role: "ADMIN",
    department: "Human Resources",
    email: "elena.admin@company.com",
  },
  staff_hr: {
    id: "staff_hr",
    name: "Marcus (HR Staff)",
    role: "HR_STAFF",
    department: "Human Resources",
    email: "marcus.hr@company.com",
  },
  supervisor_it: {
    id: "supervisor_it",
    name: "Sarah Richards (IT Supervisor)",
    role: "SUPERVISOR",
    department: "Information Technology",
    email: "sarah.supervisor@company.com",
  },

  supervisor_mktg: {
    id: "supervisor_mktg",
    name: "Anna Lopez (Marketing Supervisor)",
    role: "SUPERVISOR",
    department: "Marketing",
    email: "anna.marketing@company.com",
  },
  supervisor_hr: {
    id: "supervisor_hr",
    name: "Paolo Cruz (HR Supervisor)",
    role: "SUPERVISOR",
    department: "Human Resources",
    email: "paolo.hr@company.com",
  },

  // --- INTERNS (Detailed Personal Info matching your UI) ---
  //IT Interns
  intern_it: {
    id: "intern_it",
    role: "INTERN",
    supervisorId: "supervisor_it",
    department: "Information Technology",
    name: "Alex Santos",
    firstName: "Alex",
    lastName: "Santos",
    phone: "09123456781",
    email: "alex.it@company.com",
    dob: "05/14/2002",
    maritalStatus: "Single",
    gender: "Male",
    nationality: "Filipino",
    address: "123 Tech Street, Brgy. San Jose",
    city: "Bacoor",
    zipCode: "4102",
    university: "Polytechnic University of the Philippines (PUP iTech)",
    course: "Diploma in Information Technology",
    hours: "500 hours",
    duration: "Feb 16, 2026 - May 30, 2026",
    year: "3rd Year",
    graduation: "July 2026",
  },
  intern_it_2: {
    id: "intern_it_2",
    role: "INTERN",
    supervisorId: "supervisor_it",
    department: "Information Technology",
    name: "Nathan Dela Cruz",
    firstName: "Nathan",
    lastName: "Dela Cruz",
    phone: "09123456782",
    email: "nathan.it@company.com",
    dob: "03/18/2002",
    maritalStatus: "Single",
    gender: "Male",
    nationality: "Filipino",
    address: "Bacoor, Cavite",
    city: "Bacoor",
    zipCode: "4102",
    university: "Technological University of the Philippines",
    course: "BS Information Technology",
    hours: "500 hours",
    duration: "Feb 16, 2026 - May 30, 2026",
    year: "3rd Year",
    graduation: "July 2026",
  },
  intern_it_3: {
    id: "intern_it_3",
    role: "INTERN",
    supervisorId: "supervisor_it",
    department: "Information Technology",
    name: "Mika Torres",
    firstName: "Mika",
    lastName: "Torres",
    phone: "09123456783",
    email: "mika.it@company.com",
    dob: "09/10/2003",
    maritalStatus: "Single",
    gender: "Female",
    nationality: "Filipino",
    address: "Las Piñas City",
    city: "Las Piñas",
    zipCode: "1740",
    university: "AMA Online University",
    course: "BS Information Technology",
    hours: "600 hours",
    duration: "Feb 16, 2026 - May 30, 2026",
    year: "3rd Year",
    graduation: "August 2026",
  },
  //Marketing Interns
  intern_mktg: {
    id: "intern_mktg",
    role: "INTERN",
    supervisorId: "supervisor_mktg",
    department: "Marketing",
    name: "Chloe Mendoza",
    firstName: "Chloe",
    lastName: "Mendoza",
    phone: "09171234567",
    email: "chloe.mktg@company.com",
    dob: "08/22/2001",
    maritalStatus: "Single",
    gender: "Female",
    nationality: "Filipino",
    address: "456 Taft Avenue",
    city: "Manila",
    zipCode: "1000",
    university: "De La Salle University",
    course: "BS Business Administration",
    hours: "300 hours",
    duration: "Feb 16, 2026 - May 30, 2026",
    year: "4th Year",
    graduation: "October 2026",
  },
  intern_mktg_2: {
    id: "intern_mktg_2",
    role: "INTERN",
    supervisorId: "supervisor_mktg",
    department: "Marketing",
    name: "Bianca Ramos",
    firstName: "Bianca",
    lastName: "Ramos",
    phone: "09171234568",
    email: "bianca.mktg@company.com",
    dob: "12/01/2001",
    maritalStatus: "Single",
    gender: "Female",
    nationality: "Filipino",
    address: "Makati City",
    city: "Makati",
    zipCode: "1200",
    university: "University of Makati",
    course: "BS Marketing Management",
    hours: "300 hours",
    duration: "Feb 16, 2026 - May 30, 2026",
    year: "4th Year",
    graduation: "October 2026",
  },

  intern_mktg_3: {
    id: "intern_mktg_3",
    role: "INTERN",
    supervisorId: "supervisor_mktg",
    department: "Marketing",
    name: "Jared Lim",
    firstName: "Jared",
    lastName: "Lim",
    phone: "09171234569",
    email: "jared.mktg@company.com",
    dob: "06/25/2002",
    maritalStatus: "Single",
    gender: "Male",
    nationality: "Filipino",
    address: "Manila",
    city: "Manila",
    zipCode: "1000",
    university: "Far Eastern University",
    course: "BS Business Administration",
    hours: "300 hours",
    duration: "Feb 16, 2026 - May 30, 2026",
    year: "4th Year",
    graduation: "October 2026",
  },
  //HR Interns
  intern_hr: {
    id: "intern_hr",
    role: "INTERN",
    supervisorId: "supervisor_hr",
    department: "Human Resources",
    name: "David Reyes",
    firstName: "David",
    lastName: "Reyes",
    phone: "09209876543",
    email: "david.hr@company.com",
    dob: "11/05/2000",
    maritalStatus: "Single",
    gender: "Male",
    nationality: "Filipino",
    address: "789 Emerald Ave, Ortigas",
    city: "Pasig",
    zipCode: "1605",
    university: "University of Santo Tomas",
    course: "BS Psychology",
    hours: "400 hours",
    duration: "Feb 16, 2026 - May 30, 2026",
    year: "4th Year",
    graduation: "June 2026",
  },
  intern_hr_2: {
    id: "intern_hr_2",
    role: "INTERN",
    supervisorId: "supervisor_hr",
    department: "Human Resources",
    name: "Kyla Garcia",
    firstName: "Kyla",
    lastName: "Garcia",
    phone: "09209876544",
    email: "kyla.hr@company.com",
    dob: "02/14/2002",
    maritalStatus: "Single",
    gender: "Female",
    nationality: "Filipino",
    address: "Pasig City",
    city: "Pasig",
    zipCode: "1605",
    university: "University of Santo Tomas",
    course: "BS Psychology",
    hours: "400 hours",
    duration: "Feb 16, 2026 - May 30, 2026",
    year: "4th Year",
    graduation: "June 2026",
  },

  intern_hr_3: {
    id: "intern_hr_3",
    role: "INTERN",
    supervisorId: "supervisor_hr",
    department: "Human Resources",
    name: "Marco Villanueva",
    firstName: "Marco",
    lastName: "Villanueva",
    phone: "09209876545",
    email: "marco.hr@company.com",
    dob: "10/30/2001",
    maritalStatus: "Single",
    gender: "Male",
    nationality: "Filipino",
    address: "Taguig City",
    city: "Taguig",
    zipCode: "1630",
    university: "PUP Manila",
    course: "BS Human Resource Management",
    hours: "400 hours",
    duration: "Feb 16, 2026 - May 30, 2026",
    year: "4th Year",
    graduation: "June 2026",
  },
};

export const dummyDepartments = [
  {
    title: 'IT Department',
    count: 3,
    members: [
      { name: 'John Doe', role: 'IT Intern' },
      { name: 'Jane Doe', role: 'HR Intern' },
      { name: 'Jonathan Doe', role: 'IT Intern' },
    ],
  },
  {
    title: 'Sales Department',
    count: 3,
    members: [
      { name: 'Darrell Steward', role: 'Sr. Sales Manager' },
      { name: 'Courtney Henry', role: 'BDM' },
      { name: 'Kathryn Murphy', role: 'BDE' },
    ],
  },
  {
    title: 'Project Manager Department',
    count: 2,
    members: [
      { name: 'Ronald Richards', role: 'Sr. Project Manager' },
      { name: 'Savannah Nguyen', role: 'Project Manager' },
    ],
  },
  {
    title: 'Marketing Department',
    count: 2,
    members: [
      { name: 'Brooklyn Simmons', role: 'Sr. Marketing Manager' },
      { name: 'Kristin Watson', role: 'Marketing Coordinator' },
    ],
  },
];

const USERS_DB_KEY = "hrims_users_db";
const DEPARTMENTS_DB_KEY = "hrims_departments_db";
const MOA_UPLOADS_DB_KEY = "hrims_moa_uploads_db";

const canUseLocalStorage = () => typeof window !== "undefined" && window.localStorage;

const readFileAsDataUrl = (file) =>
  new Promise((resolve) => {
    if (!file || typeof FileReader === "undefined") {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result || "");
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });

export const getStoredDepartments = () => {
  if (!canUseLocalStorage()) {
    return dummyDepartments;
  }

  const storedDepartments = localStorage.getItem(DEPARTMENTS_DB_KEY);

  if (!storedDepartments) {
    localStorage.setItem(DEPARTMENTS_DB_KEY, JSON.stringify(dummyDepartments));
    return dummyDepartments;
  }

  try {
    return JSON.parse(storedDepartments);
  } catch {
    localStorage.setItem(DEPARTMENTS_DB_KEY, JSON.stringify(dummyDepartments));
    return dummyDepartments;
  }
};

export const addEmployeeToTemporaryDatabase = (departmentTitle, employeeData) => {
  const departments = getStoredDepartments();
  const now = Date.now();
  const employeeId = String(now);
  const fullName = `${employeeData.firstName} ${employeeData.lastName}`.trim();
  const designation = employeeData.designation || "Employee";

  const nextDepartments = departments.map((department) => {
    if (department.title !== departmentTitle) {
      return department;
    }

    return {
      ...department,
      count: department.count + 1,
      members: [
        ...department.members,
        {
          id: employeeId,
          name: fullName,
          role: designation,
          email: employeeData.email,
          phone: employeeData.phone,
          type: employeeData.type || "Office",
          status: employeeData.status || "Permanent",
        },
      ],
    };
  });

  if (!canUseLocalStorage()) {
    return { employeeId, departments: nextDepartments };
  }

  const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || JSON.stringify(mockUsers));

  localStorage.setItem(DEPARTMENTS_DB_KEY, JSON.stringify(nextDepartments));
  localStorage.setItem(
    USERS_DB_KEY,
    JSON.stringify({
      ...users,
      [employeeId]: {
        id: employeeId,
        role: "EMPLOYEE",
        department: departmentTitle,
        name: fullName,
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        phone: employeeData.phone,
        email: employeeData.email,
        dob: employeeData.dob,
        maritalStatus: employeeData.maritalStatus,
        gender: employeeData.gender,
        nationality: employeeData.nationality,
        address: employeeData.address,
        city: employeeData.city,
        zipCode: employeeData.zipCode,
        designation,
        type: employeeData.type || "Office",
        status: employeeData.status || "Permanent",
        createdAt: new Date(now).toISOString(),
      },
    }),
  );

  return { employeeId, departments: nextDepartments };
};

export const getStoredMoaUploads = () => {
  if (!canUseLocalStorage()) {
    return {};
  }

  const storedUploads = localStorage.getItem(MOA_UPLOADS_DB_KEY);

  if (!storedUploads) {
    localStorage.setItem(MOA_UPLOADS_DB_KEY, JSON.stringify({}));
    return {};
  }

  try {
    return JSON.parse(storedUploads);
  } catch {
    localStorage.setItem(MOA_UPLOADS_DB_KEY, JSON.stringify({}));
    return {};
  }
};

export const saveMoaUploadToTemporaryDatabase = async (moaData) => {
  const now = moaData.uploadedAt || new Date().toISOString();
  const university = moaData.university || {};
  const universityId = String(university.id ?? Date.now());
  const file = moaData.file;
  const fileDataUrl = await readFileAsDataUrl(file);
  const previousUploads = getStoredMoaUploads();
  const previousUniversityUpload = previousUploads[universityId];

  const nextUpload = {
    id: `${universityId}-${Date.now()}`,
    universityId,
    universityName: university.name || "University",
    branch: university.branch || "Branch/Campus",
    startDate: moaData.startDate,
    endDate: moaData.endDate,
    applyToAll: Boolean(moaData.applyToAll),
    status: "ACTIVE",
    uploadedAt: now,
    fileName: file?.name || "MOA.pdf",
    fileType: file?.type || "application/pdf",
    fileSize: file?.size || 0,
    fileDataUrl,
  };

  const nextUploads = {
    ...previousUploads,
    [universityId]: {
      ...nextUpload,
      history: [nextUpload, ...(previousUniversityUpload?.history || [])],
    },
  };

  if (!canUseLocalStorage()) {
    return nextUploads[universityId];
  }

  try {
    localStorage.setItem(MOA_UPLOADS_DB_KEY, JSON.stringify(nextUploads));
    return nextUploads[universityId];
  } catch {
    const smallerUpload = {
      ...nextUpload,
      fileDataUrl: "",
      storageWarning: "File content was too large for temporary browser storage.",
    };
    const smallerUploads = {
      ...previousUploads,
      [universityId]: {
        ...smallerUpload,
        history: [
          smallerUpload,
          ...(previousUniversityUpload?.history || []).map((upload) => ({
            ...upload,
            fileDataUrl: "",
          })),
        ],
      },
    };

    localStorage.setItem(MOA_UPLOADS_DB_KEY, JSON.stringify(smallerUploads));
    return smallerUploads[universityId];
  }
};

const parseInternshipDuration = (duration = "") => {
  const [startValue, endValue] = duration.split(" - ");
  const startDate = startValue ? new Date(startValue) : null;
  const endDate = endValue ? new Date(endValue) : null;

  return {
    startDate: startDate && !Number.isNaN(startDate.getTime()) ? startDate : null,
    endDate: endDate && !Number.isNaN(endDate.getTime()) ? endDate : null,
  };
};

const getInternLifecycleStatus = (intern, today = new Date()) => {
  const status = intern.status || intern.internshipStatus || "";

  if (status === "Completed") return "Completed";
  if (["Deploy", "Active", "Approved"].includes(status)) return "Active";

  const { startDate, endDate } = parseInternshipDuration(intern.duration);
  if (endDate && endDate < today) return "Completed";
  if (startDate && endDate && startDate <= today && today <= endDate) {
    return "Active";
  }

  return status || "Pending";
};

const activityLabels = {
  [LOG_TYPES.NEW_UNIVERSITY]: "New partner university",
  [LOG_TYPES.NEW_INTERN]: "New intern received",
  [LOG_TYPES.INTERN_COMPLETED]: "Intern completed",
  [LOG_TYPES.MOA_UPLOADED]: "New MOA received",
  [LOG_TYPES.MOA_EXPIRING]: "MOA expiring soon",
};

const activityColors = {
  [LOG_TYPES.NEW_UNIVERSITY]: "bg-violet-300",
  [LOG_TYPES.NEW_INTERN]: "bg-sky-300",
  [LOG_TYPES.INTERN_COMPLETED]: "bg-emerald-400",
  [LOG_TYPES.MOA_UPLOADED]: "bg-blue-300",
  [LOG_TYPES.MOA_EXPIRING]: "bg-amber-400",
};

const getActivityTimestamp = (value) => {
  const timestamp = value ? new Date(value).getTime() : Date.now();
  return Number.isNaN(timestamp) ? Date.now() : timestamp;
};

const toDashboardActivity = ({ action, description, createdAt, id }) => ({
  id: id || `${action}-${createdAt}-${description}`,
  action,
  label: activityLabels[action] || "System activity",
  description,
  color: activityColors[action] || "bg-slate-300",
  createdAt,
  timestamp: getActivityTimestamp(createdAt),
});

export const getHrAdminRecentActivities = (limit = 5) => {
  const users = canUseLocalStorage()
    ? JSON.parse(localStorage.getItem(USERS_DB_KEY) || JSON.stringify(mockUsers))
    : mockUsers;
  const interns = Object.values(users).filter((user) => user.role === "INTERN");
  const moaUploads = Object.values(getStoredMoaUploads());
  const wantedActions = new Set([
    LOG_TYPES.NEW_UNIVERSITY,
    LOG_TYPES.NEW_INTERN,
    LOG_TYPES.INTERN_COMPLETED,
    LOG_TYPES.MOA_UPLOADED,
    LOG_TYPES.MOA_EXPIRING,
  ]);
  const today = new Date();
  const expiringWindow = new Date(today);
  expiringWindow.setDate(today.getDate() + 30);

  const loggedActivities = getSystemLogs()
    .filter((log) => wantedActions.has(log.action))
    .map((log) =>
      toDashboardActivity({
        id: log.id,
        action: log.action,
        description: log.description,
        createdAt: log.createdAt,
      }),
    );

  const universityActivities = Array.from(
    interns.reduce((universities, intern) => {
      if (!intern.university || universities.has(intern.university)) {
        return universities;
      }

      const { startDate } = parseInternshipDuration(intern.duration);
      universities.set(
        intern.university,
        toDashboardActivity({
          action: LOG_TYPES.NEW_UNIVERSITY,
          description: `${intern.university} is now listed as a partner university.`,
          createdAt: intern.createdAt || startDate?.toISOString() || new Date().toISOString(),
        }),
      );
      return universities;
    }, new Map()).values(),
  );

  const internActivities = interns.map((intern) => {
    const { startDate } = parseInternshipDuration(intern.duration);
    return toDashboardActivity({
      action: LOG_TYPES.NEW_INTERN,
      description: `${intern.name} from ${intern.university || "a partner university"} was added.`,
      createdAt: intern.createdAt || startDate?.toISOString() || new Date().toISOString(),
    });
  });

  const completedActivities = interns
    .filter((intern) => getInternLifecycleStatus(intern, today) === "Completed")
    .map((intern) => {
      const { endDate } = parseInternshipDuration(intern.duration);
      return toDashboardActivity({
        action: LOG_TYPES.INTERN_COMPLETED,
        description: `${intern.name} completed the internship program.`,
        createdAt: endDate?.toISOString() || intern.updatedAt || new Date().toISOString(),
      });
    });

  const moaActivities = moaUploads.map((moa) =>
    toDashboardActivity({
      id: moa.id,
      action: LOG_TYPES.MOA_UPLOADED,
      description: `${moa.fileName} was uploaded for ${moa.universityName}.`,
      createdAt: moa.uploadedAt,
    }),
  );

  const expiringMoaActivities = moaUploads
    .filter((moa) => {
      const endDate = new Date(moa.endDate);
      return (
        moa.endDate &&
        !Number.isNaN(endDate.getTime()) &&
        endDate >= today &&
        endDate <= expiringWindow
      );
    })
    .map((moa) =>
      toDashboardActivity({
        id: `${moa.id}-expiring`,
        action: LOG_TYPES.MOA_EXPIRING,
        description: `${moa.universityName}'s MOA expires on ${new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(new Date(moa.endDate))}.`,
        createdAt: moa.endDate,
      }),
    );

  return [
    ...loggedActivities,
    ...moaActivities,
    ...expiringMoaActivities,
    ...completedActivities,
    ...internActivities,
    ...universityActivities,
  ]
    .sort((a, b) => b.timestamp - a.timestamp)
    .filter(
      (activity, index, activities) =>
        index ===
        activities.findIndex(
          (candidate) =>
            candidate.action === activity.action &&
            candidate.description === activity.description,
        ),
    )
    .slice(0, limit);
};

export const getHrAdminDashboardMetrics = () => {
  const users = canUseLocalStorage()
    ? JSON.parse(localStorage.getItem(USERS_DB_KEY) || JSON.stringify(mockUsers))
    : mockUsers;
  const interns = Object.values(users).filter((user) => user.role === "INTERN");
  const totalInterns = interns.length;
  const completedInterns = interns.filter(
    (intern) => getInternLifecycleStatus(intern) === "Completed",
  ).length;
  const activeInterns = interns.filter(
    (intern) => getInternLifecycleStatus(intern) === "Active",
  ).length;
  const partnerUniversities = new Set(
    interns.map((intern) => intern.university).filter(Boolean),
  ).size;
  const getPercent = (value) =>
    totalInterns ? `${Math.round((value / totalInterns) * 100)}%` : "0%";

  return [
    {
      title: "Total Interns",
      value: String(totalInterns),
      trend: "100%",
      trendType: "up",
    },
    {
      title: "Completed Interns",
      value: String(completedInterns),
      trend: getPercent(completedInterns),
      trendType: "up",
    },
    {
      title: "Active Interns",
      value: String(activeInterns),
      trend: getPercent(activeInterns),
      trendType: "up",
    },
    {
      title: "Partner Universities",
      value: String(partnerUniversities),
      trend: "100%",
      trendType: "up",
    },
  ];
};

// It writes the data above into the browser so the app can use it.
export const initializeMockDatabase = () => {
  if (!localStorage.getItem(USERS_DB_KEY)) {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(mockUsers));
    console.log("✅ Mock Database Initialized!");
  } else {
    console.log("ℹ️ Mock Database already exists.");
  }

  if (!localStorage.getItem(DEPARTMENTS_DB_KEY)) {
    localStorage.setItem(DEPARTMENTS_DB_KEY, JSON.stringify(dummyDepartments));
  }

  if (!localStorage.getItem("hrims_evaluations_db")) {
    localStorage.setItem("hrims_evaluations_db", JSON.stringify([]));
  }
  if (!localStorage.getItem(MOA_UPLOADS_DB_KEY)) {
    localStorage.setItem(MOA_UPLOADS_DB_KEY, JSON.stringify({}));
  }
  console.log("✅ Mock Database Updated with Profile Data!");
};


// --- SYSTEM LOGS ---
export const dummyLogs = [
  {
    timestamp: '2026-04-06 | 09:12:34',
    user: 'Supervisor 1',
    role: 'Supervisor',
    action: 'Login',
    description: 'Supervisor 1 logged into the system.',
    details: 'View',
  },
  {
    timestamp: '2026-04-06 | 09:18:02',
    user: 'Intern 1',
    role: 'Intern',
    action: 'Submit Application',
    description: 'Intern 1 submitted an application.',
    details: 'View',
  },
  {
    timestamp: '2026-04-06 | 09:25:47',
    user: 'HR Staff 1',
    role: 'HR Staff',
    action: 'Update Record',
    description: 'HR Staff 1 updated intern record.',
    details: 'View',
  },
  {
    timestamp: '2026-04-06 | 09:34:21',
    user: 'Supervisor 2',
    role: 'Supervisor',
    action: 'Approve Request',
    description: 'Supervisor 2 approved a request.',
    details: 'View',
  },
];



export const hrAdminDashboardData = {
  greeting: {
    name: '[Name]',
    message: 'Good Morning',
    dateLabel: 'Today:',
    dateValue: '28th March 2023',
  },
  quickActions: [
    { id: 'add_intern', label: 'Add Intern' },
    { id: 'generate_report', label: 'Generate Report' },
  ],
  metrics: [
    { title: 'Total Interns', value: '470', trend: '12%', trendType: 'up' },
    { title: 'Completed Interns', value: '1050', trend: '3%', trendType: 'up' },
    { title: 'Active Interns', value: '470', trend: '8%', trendType: 'down' },
    { title: 'Partner Universities', value: '12', trend: '12%', trendType: 'up' },
  ],
  recentActivity: [
    { label: 'New application submitted', description: 'Description', color: 'bg-sky-300' },
    { label: 'Supervisor evaluation completed', description: 'Description', color: 'bg-emerald-400' },
    { label: 'New DTR submitted', description: 'Description', color: 'bg-sky-300' },
    { label: 'MOA uploaded', description: 'Description', color: 'bg-sky-300' },
  ],
  attendanceOverview: {
    filterLabel: 'Today',
    days: [
      { day: 'Mon', levels: [58, 88, 98] },
      { day: 'Tue', levels: [58, 78, 98] },
      { day: 'Web', levels: [45, 74, 98] },
      { day: 'Thu', levels: [58, 88, 98] },
      { day: 'Fri', levels: [75, 82, 98] },
      { day: 'Sat', levels: [42, 75, 98] },
      { day: 'Sun', levels: [42, 85, 98] },
    ],
  },
};


// --- CHART DATA ---
export const dummyChartDays = [
  { week: 'Week 1', values: [32, 46, 22, 40, 28, 56, 50, 74, 64, 84, 76, 99] },
  { week: 'Week 2', values: [22, 36, 52, 56, 44, 48, 62, 84, 82, 92, 90, 96] },
  { week: 'Week 3', values: [38, 60, 34, 52, 66, 76, 72, 94, 88, 80, 96, 90] },
];

export const dummyUniversities = [
  { name: 'CIT-U', value: 23, color: '#22c55e' },
  { name: 'PUP iTech', value: 30, color: '#a855f7' },
  { name: 'De La Salle University', value: 34, color: '#38bdf8' },
  { name: 'University of Santo Tomas', value: 19, color: '#f59e0b' },
  { name: 'Far Eastern University', value: 26, color: '#ef4444' },
  { name: 'University of Makati', value: 15, color: '#06b6d4' },
  { name: 'AMA Online University', value: 21, color: '#ec4899' },
  { name: 'Technological University of the Philippines', value: 24, color: '#8b5cf6' },
  { name: 'Polytechnic University of the Philippines', value: 32, color: '#14b8a6' },
  { name: 'USJR', value: 15, color: '#f97316' },
];

export const dummyInternshipOverview = [
  { label: 'CIT-U', incoming: 12, active: 8, finalizing: 3 },
  { label: 'PUP iTech', incoming: 15, active: 10, finalizing: 5 },
  { label: 'De La Salle University', incoming: 18, active: 12, finalizing: 4 },
  { label: 'University of Santo Tomas', incoming: 10, active: 7, finalizing: 2 },
  { label: 'Far Eastern University', incoming: 14, active: 9, finalizing: 3 },
  { label: 'University of Makati', incoming: 8, active: 5, finalizing: 2 },
  { label: 'AMA Online University', incoming: 11, active: 6, finalizing: 4 },
  { label: 'Technological University of the Philippines', incoming: 13, active: 8, finalizing: 3 },
  { label: 'Polytechnic University of the Philippines', incoming: 16, active: 11, finalizing: 5 },
  { label: 'USJR', incoming: 9, active: 4, finalizing: 2 },
];

// --- METRICS ---
export const dummyMetrics = [
  { label: 'Active Interns', value: '28', accent: 'bg-emerald-500', text: 'text-emerald-700' },
  { label: 'Incoming Interns', value: '15', accent: 'bg-amber-400', text: 'text-amber-700' },
  { label: 'Finalizing Internship', value: '5', accent: 'bg-rose-400', text: 'text-rose-700' },
];

export const dummyFolders = [
  { title: 'MOA', files: 25, color: 'bg-amber-100', icon: 'briefcase' },
  { title: 'NDA', files: 25, color: 'bg-emerald-100', icon: 'shield' },
  { title: 'Endorsement Letter', files: 25, color: 'bg-rose-100', icon: 'file-text' },
];
