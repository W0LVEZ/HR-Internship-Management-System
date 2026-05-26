import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
{
  /* Supervisor Pages */
}
import {
  // SupervisorLayout,
  SupervisorDashboard,
  SupervisorMyInterns,
  SupervisorAttendance,
  SupervisorTasks,
  SupervisorEvaluations,
  SupervisorNotifications,
  SupervisorDocuments,
} from "../portals/supervisor/Index";
import SupervisorLayout from "../portals/supervisor/layouts/SupervisorLayout";
import SupervisorTaskDetails from "../portals/supervisor/pages/SupervisorTaskDetails";

//HR-ADMIN
import HrAdminLayout from "../portals/hr-admin/layouts/HrAdminLayout";
import HrAdminDashboard from "../portals/hr-admin/pages/HrAdminDashboard";
import AdminRecruitmentPage from "../portals/hr-admin/pages/AdminRecruitmentPage";
import AdminInternManagementPage from "../portals/hr-admin/pages/AdminInternManagementPage";
import AdminStaffManagementPage from "../portals/hr-admin/pages/AdminStaffManagementPage";
import AdminDocumentVault from "../portals/hr-admin/pages/AdminDocumentVault";
import ReportAnalyticsPage from "../portals/hr-admin/pages/ReportAnalyticsPage";
import SystemLogs from "../portals/hr-admin/pages/SystemLogs";

//HR-STAFF
import HrStaffLayout from "../portals/hr-staff/layouts/HrStaffLayout";
import HRStaffDashboard from "../portals/hr-staff/pages/HrStaffDashboard";
import RecruitmentPage from "../portals/hr-staff/pages/RecruitmentPage";
import StaffManagementPage from "../portals/hr-staff/pages/StaffManagement";
import DocumentVault from "../portals/hr-staff/pages/DocumentVault";

//LANDING PAGE
import LandingPageHeader from "../common/components/layout/LandingPageHeader";
import LandingPage from "../portals/Home/pages/LandingPage";
import LoginPage from "../portals/Home/pages/LoginPage";

//INTERN
import InternLayout from "../portals/interns/layouts/InternLayout";
import InternDashboard from "../portals/interns/pages/InternDashboard";
import Profile from "../portals/interns/pages/Profile";
import Tasks from "../portals/interns/pages/Tasks";
import Attendance from "../portals/interns/pages/Attendance";
import Documents from "../portals/interns/pages/Documents";
import NotificationsPage from "../portals/interns/pages/InternNotificationPage";
import InternCalendarPage from "../portals/interns/pages/InternCalendarPage";
import SettingsPage from "../common/components/layout/SettingsPage";
import InternEvaluation from "../portals/interns/pages/InternEvaluation";

//APPLICATION
import ApplicationForm from "../portals/Home/pages/ApplicationForm";
import ApplicationFormHeader from "../portals/Home/components/layout/ApplicationFormHeader";

//APPLICANT
import ApplicantLayout from "../portals/applicant-intern/components/layout/ApplicantLayout";
import ApplicantNotificationPage from "../portals/applicant-intern/pages/Notification";
import Dashboard from "../portals/applicant-intern/pages/Dashboard";
import MyApplication from "../portals/applicant-intern/pages/MyApplication";
import Settings from "../portals/applicant-intern/pages/Settings";
import InternManagementPage from "../portals/hr-staff/pages/InternManagementPage";
import CreateAccountPage from "../portals/applicant-intern/pages/CreateAccountPage";
import ApplicantCalendarPage from "../portals/applicant-intern/pages/CalendarPage";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/*Landing page route*/}
        <Route path="/" element={<LandingPageHeader />}>
          <Route index element={<LandingPage />} />
        </Route>
        {/* Login page route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Create Account Route */}
        <Route path="/create-account" element={<CreateAccountPage />} />

        {/* Application form intern route */}
        <Route path="/application-form" element={<ApplicationFormHeader />}>
          <Route index element={<ApplicationForm />} />
        </Route>

        {/* Applicant page route for pending interns */}
        <Route path="/applicant" element={<ApplicantLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="notifications" element={<ApplicantNotificationPage />} />
          <Route path="my-application" element={<MyApplication />} />
          <Route path="settings" element={<Settings />} />
          <Route path="calendar" element={<ApplicantCalendarPage />} />
        </Route>

        {/* Intern Page Route */}
        <Route path="/intern" element={<InternLayout />}>
          <Route index element={<InternDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="documents" element={<Documents />} />
          <Route path="evaluation" element={<InternEvaluation />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="calendar" element={<InternCalendarPage />} />
        </Route>

        {/* Supervisor Route */}
        <Route path="/supervisor" element={<SupervisorLayout />}>
          <Route index element={<SupervisorDashboard />} />
          <Route path="myinterns" element={<SupervisorMyInterns />} />
          <Route path="attendance" element={<SupervisorAttendance />} />
          <Route path="tasks" element={<SupervisorTasks />} />
          <Route path="tasks/:internId" element={<SupervisorTaskDetails />} />
          <Route path="documents" element={<SupervisorDocuments />} />
          <Route path="evaluations" element={<SupervisorEvaluations />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="notifications" element={<SupervisorNotifications />} />
        </Route>

        {/* HR-STAFF Page Route */}
        <Route path="/hr-staff" element={<HrStaffLayout />}>
          <Route index element={<HRStaffDashboard />} />
          <Route path="recruitment" element={<RecruitmentPage />} />
          <Route path="intern-management" element={<InternManagementPage />} />
          <Route path="staff-management" element={<StaffManagementPage />} />
          <Route path="document-vault" element={<DocumentVault />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* HR-ADMIN Page Route */}
        <Route path="/hr-admin" element={<HrAdminLayout />}>
          <Route index element={<HrAdminDashboard />} />
          <Route path="recruitment" element={<AdminRecruitmentPage />} />
          <Route
            path="intern-management"
            element={<AdminInternManagementPage />}
          />
          <Route
            path="staff-management"
            element={<AdminStaffManagementPage />}
          />
          <Route path="document-vault" element={<AdminDocumentVault />} />
          <Route path="document-vault/:folderId" element={<AdminDocumentVault />} />
          <Route
            path="reports-and-analytics"
            element={<ReportAnalyticsPage />}
          />
          <Route path="system-logs" element={<SystemLogs />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
