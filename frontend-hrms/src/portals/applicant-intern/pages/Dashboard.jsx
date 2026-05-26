import Header from "../../../common/components/layout/Header";
import GreetingHeader from "../../../common/components/ui/GreetingHeader";
import CalendarPanel from "../../interns/components/ui/CalendarPanel";
import ApplicationTaskList from "../components/ui/ApplicationTaskList";
import Calendar from "../components/ui/Calendar";
import DashboardStepper from "../components/ui/DashboardStepper";

export default function Dashboard() {
  // Read from applicants_db to match your working MyApplication page
  const applicants = JSON.parse(localStorage.getItem("applicants_db") || "[]");
  const applicant = applicants[applicants.length - 1] || {};

  const fullName = applicant.firstName
    ? `${applicant.firstName} ${applicant.lastName || ""}`
    : "Applicant";

  // --- DYNAMIC PROGRESS LOGIC ---
  const documents = applicant.documents || [];
  const uploadedDocsCount = documents.filter(
    (doc) => doc.name || doc.fileName || typeof doc === "string",
  ).length;

  let currentStep = 1;
  let status = "warning";
  let statusMessage = "Please complete your personal information profile.";
  let progressPercentage = 20;

  if (applicant.firstName) {
    // Step 1 done -> Move to Education
    currentStep = 2;
    statusMessage = "Please complete your educational background details.";
    progressPercentage = 40;
  }

  if (applicant.firstName && applicant.region) {
    // or whatever indicates education is done
    // Step 2 done -> Move to Documents
    currentStep = 3;
    progressPercentage = 60;

    // Explicitly check if they have uploaded less than the 5 required documents
    if (uploadedDocsCount < 5) {
      status = "warning";
      statusMessage = `Continue uploading your required documents (${uploadedDocsCount}/5 done).`;
    } else {
      // Only move to Step 4 when they hit exactly 5 files!
      currentStep = 4;
      status = "success";
      statusMessage =
        "Documents submitted successfully! Your application is under screening.";
      progressPercentage = 80;
    }
  }

  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Track application progress"
        userRole="applicant"
      />
      <GreetingHeader name={fullName} />

      {/* Added px-6 md:px-8 and pb-8 here to push the cards inward from the screen edges! */}
      <div className="flex flex-col h-full px-6 md:px-8 pb-8">
        <div className="flex flex-col lg:flex-row gap-6 mt-8">
          <div className="flex-[2] bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-8">
              Internship Application
            </h3>

            {/* 1. The Stepper (with built-in status banner) */}
            <DashboardStepper
              currentStep={currentStep}
              status={status}
              statusMessage={statusMessage}
            />

            {/* 2. The Task List (Accordion & Tasks) */}
            <ApplicationTaskList
              documentsList={documents}
              progress={progressPercentage}
            />
          </div>

          {/* Empty box to hold space until we build the Calendar component */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 h-fit">
            <Calendar />
          </div>
        </div>
      </div>
    </>
  );
}
