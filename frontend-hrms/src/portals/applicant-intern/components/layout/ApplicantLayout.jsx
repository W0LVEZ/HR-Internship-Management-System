import { Outlet } from "react-router-dom";
import Sidebar from "../../../../common/components/layout/Sidebar";
import { navigation } from "../../../../common/config/navigation";

export default function ApplicantLayout() {
  const userRole = "applicant";

  // FIX: Read from applicants_db so it successfully finds Micheal Jackson!
  const applicants = JSON.parse(localStorage.getItem("applicants_db") || "[]");
  const currentApplicant = applicants[applicants.length - 1] || {};

  // Construct the correct name, falling back to "Applicant" if empty
  const fullName = currentApplicant.firstName
    ? `${currentApplicant.firstName} ${currentApplicant.lastName || ""}`
    : "Applicant";

  return (
    <div className="flex">
      {/* Sidebar now receives the correct dynamic name and role pool */}
      <Sidebar
        links={navigation[userRole]}
        role="APPLICANT"
        userName={fullName}
      />

      {/* Main content area */}
      <div className="ml-60 p-6 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
