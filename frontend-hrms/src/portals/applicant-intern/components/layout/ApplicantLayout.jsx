import { Outlet } from "react-router-dom";
import Sidebar from "../../../../common/components/layout/Sidebar";
import { navigation } from "../../../../common/config/navigation";

export default function ApplicantLayout() {
  const userRole = "applicant"; // This should ideally come from auth context or state management

  return (
    <div className="flex">
      {/* Sidebar should always be visible*/}
      <Sidebar
        links={navigation[userRole]}
        role="applicant"
        userName="applicant"
      />{" "}
      {/* Temp Sidebar Profile Name & Role */}
      {/* Main content area */}
      <div className="ml-60 p-6 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
