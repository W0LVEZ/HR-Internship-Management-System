import { useState } from "react";
import Header from "../../../common/components/layout/Header";
import { User, Briefcase, FileText } from "lucide-react";
import PersonalInformation from "../components/ui/PersonalInformation";
import Education from "../components/ui/Education";
import Documents from "../components/ui/Documents";

export default function MyApplication() {
  // State to track which tab is currently active
  const [activeTab, setActiveTab] = useState("personal");

  const applicants = JSON.parse(localStorage.getItem("applicants_db") || "[]");
  const applicant = applicants[applicants.length - 1];

  // Array of tabs to make rendering easy and clean
  const tabs = [
    { id: "personal", label: "Personal Information", icon: User },
    { id: "education", label: "Education", icon: Briefcase },
    { id: "documents", label: "Documents", icon: FileText },
  ];

  if (!applicant) {
    return (
      <div className="flex flex-col h-full bg-[#F8F9FA]">
        <Header
          title="My application"
          subtitle="Update and upload documents"
          userRole="applicant"
        />

        <div className="p-8">
          <div className="card-panel">
            <h2 className="text-xl font-bold">No application found</h2>
            <p className="text-gray-500 mt-2">
              Please complete your application first.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA]">
      <Header
        title="My application"
        subtitle="Update and upload documents"
        userRole="applicant"
      />

      <div className="p-6 md:p-8 , ml-">
        {/* ================= TABS NAVIGATION ================= */}
        <div className="flex items-center gap-8 border-b border-gray-200 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 text-[15px] font-medium transition-colors relative ${
                  isActive
                    ? "text-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon size={18} />
                {tab.label}

                {/* Active Purple Underline */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full animate-fade-in"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* ================= TAB CONTENT WRAPPER ================= */}
        <div className="card-panel">
          {/* Conditional Rendering for Forms */}
          {activeTab === "personal" && (
            <div>
              <PersonalInformation applicant={applicant} />
            </div>
          )}

          {activeTab === "education" && (
            <div>
              <Education schoolInfo={applicant} />
            </div>
          )}

          {activeTab === "documents" && (
            <div>
              <Documents applicant={applicant} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
