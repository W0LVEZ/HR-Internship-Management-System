import { useState } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import ProfileSidebar from "./ProfileSidebar";
import PersonalInformation from "./PersonalInformation";
import SchoolInformation from "./SchoolInformation";
import Documents from "./Documents";
import AttendanceSection from "./sections/AttendanceSection";
import EvaluationSection from "./sections/EvaluationSection";
import TasksSection from "./sections/TasksSection";
import { useNavigate } from "react-router-dom";

export default function ProfileView({ user, mode, onReturn }) {
  {
    /* Temporary User Data
          Also used to deal with the structure mismatch
          replace this with backend 
          await fetch(`/api/users/${id}`)
      */
  }
  const formattedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,

    personal: {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      birth: user.dob,
      status: user.maritalStatus,
      gender: user.gender,
      nationality: user.nationality,
      address: user.address,
      city: user.city,
      zip: user.zipCode,
    },

    school: {
      university: user.university,
      course: user.course,
      hours: user.hours,
      duration: user.duration,
      year: user.year,
      graduation: user.graduation,
    },

    documents: user.documents || [
      "Resume.pdf",
      "MOA.pdf",
      "NDA.pdf",
      "ID.pdf",
      "Endoresement letter.pdf",
      "Certificate of Acceptance.pdf",
    ], // fallback
  };

  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [activeSection, setActiveSection] = useState("profile");

  const navigate = useNavigate();

  const normalizedMode = mode?.toLowerCase();

  const isStaff =
    normalizedMode !== "intern" && normalizedMode !== "supervisor";

  const tabs =
    mode === "INTERN"
      ? ["personal", "school", "documents"]
      : ["personal", "documents"];

  //This will use edited user when editing
  const displayUser = editedUser || formattedUser;

  // This will handle the edit click
  const handleEditToggle = () => {
    if (!isEditing) {
      setEditedUser(formattedUser); //This will start editing
      setIsEditing(true);
    } else {
      // This will save
      console.log("Saved Data: ", editedUser);

      //This is where you will connect backend
      //PUT /users/:id

      setIsEditing(false);
    }
  };

  // This will handle the input change
  const handleChange = (section, key, value) => {
    setEditedUser((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      {/* Profile Header */}
      <ProfileHeader
        user={displayUser}
        mode={mode}
        activeTab={activeTab}
        isEditing={isEditing}
        onEditClick={handleEditToggle}
        onBackClick={() => {
          if (onReturn) {
            onReturn();
            return;
          }

          if (mode === "hr-admin") navigate("/hr-admin/intern-management");
          else if (mode === "hr-staff") navigate("/hr-staff/intern-management");
          else navigate("/supervisor/myinterns");
        }}
      />

      <div className="flex items-start gap-6 mt-6">
        {/* HR-Admin & HR-Staff Sidebar */}
        {isStaff && (
          <ProfileSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        )}

        <div className="flex-1">
          {activeSection === "profile" && (
            <>
              {/* Profile Tabs */}
              <ProfileTabs
                user={displayUser}
                mode={mode}
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              {/* Tab Content */}
              <div className="mt-6">
                {activeTab === "personal" && (
                  <PersonalInformation
                    user={displayUser}
                    mode={mode}
                    isEditing={isEditing}
                    onChange={handleChange}
                  />
                )}
                {activeTab === "school" && normalizedMode === "intern" && (
                  <SchoolInformation user={displayUser} mode={mode} />
                )}
                {activeTab === "documents" && (
                  <Documents user={displayUser} mode={mode} />
                )}
              </div>
            </>
          )}

          {activeSection === "attendance" && (
            <div className="p-4">
              <AttendanceSection user={user} mode={mode} />
            </div>
          )}

          {activeSection === "tasks" && (
            <div className="p-4">
              <TasksSection user={user} />
            </div>
          )}

          {activeSection === "evaluation" && (
            <div className="p-4">
              <EvaluationSection user={displayUser} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
