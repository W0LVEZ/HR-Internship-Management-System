import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import ProfileView from "../profile/ProfileView";

import TeamCard from "./TeamCard";
import MyInternsFilterModal from "./MyInternsFilterModal";
import TeamInternList from "./TeamInternList";
import SearchInput from "../ui/SearchInput";

import { User2, CalendarRange } from "lucide-react";

export default function MyInternsPage() {
  const navigate = useNavigate();

  //This will get the role directly from mockAuth
  const { currentUser } = useAuth();

  const roleMap = {
    INTERN: "intern",
    SUPERVISOR: "supervisor",
    HR_STAFF: "hr-staff",
    ADMIN: "hr-admin",
  };

  const role = roleMap[currentUser?.role] || "";

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("interns");
  const [internList, setInternList] = useState([]);

  //Team Card View State
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedIntern, setSelectedIntern] = useState(null);

  //Filters for team card view
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  // Load interns from mock DB
  useEffect(() => {
    const db = JSON.parse(localStorage.getItem("hrims_users_db") || "{}");

    let interns = Object.values(db).filter((user) => user.role === "INTERN");

    //For supervisor only. To see the interns under this supervisor
    if (currentUser?.role === "SUPERVISOR") {
      interns = interns.filter(
        (intern) => intern.supervisorId === currentUser.id,
      );
    }

    setInternList(interns);
  }, [currentUser]);

  // This will get team number based on intern id
  //intern_it = 1
  //intern_it_2 = 2
  //intern_it_2 = 3
  const getTeamNumber = (internId = "") => {
    const match = internId.match(/_(\d+)$/);

    if (!match) return 1;

    return Number(match[1]);
  };

  const getTeamName = (intern) => {
    const teamNumber = getTeamNumber(intern.id);
    return `Team ${teamNumber} - ${intern.department || "Department"}`;
  };

  const teams = [...new Set(internList.map((intern) => getTeamName(intern)))];

  const departments = [
    ...new Set(internList.map((intern) => intern.department).filter(Boolean)),
  ];

  const courses = [
    ...new Set(internList.map((intern) => intern.course).filter(Boolean)),
  ];

  //Filter interns by search, team, department, course
  const filteredInterns = internList.filter((intern) => {
    const teamName = getTeamName(intern);

    const q = (search || "").toLowerCase();

    const matchesSearch =
      (intern.name || "").toLowerCase().includes(q) ||
      (intern.id || "").toLowerCase().includes(q) ||
      teamName.toLowerCase().includes(q);

    const matchesTeam =
      selectedTeams.length === 0 || selectedTeams.includes(teamName);

    const matchesDepartment =
      selectedDepartments.length === 0 ||
      selectedDepartments.includes(intern.department);

    const matchesCourse =
      selectedCourses.length === 0 || selectedCourses.includes(intern.course);

    return matchesSearch && matchesTeam && matchesDepartment && matchesCourse;
  });

  //This will goup interns by team number + department
  const groupedInterns = filteredInterns.reduce((groups, intern) => {
    const teamName = getTeamName(intern);

    if (!groups[teamName]) {
      groups[teamName] = [];
    }

    groups[teamName].push(intern);

    return groups;
  }, {});

  //View intern profile
  const handleView = (intern) => {
    setSelectedTeam(null);
    setSelectedIntern(intern);
  };

  const handleReturn = () => {
    setSelectedIntern(null);
    setSelectedTeam(null);
  };

  //Delete Button
  const handleDelete = (id) => {
    const updated = internList.filter((intern) => intern.id !== id);
    setInternList(updated);
  };

  const toggleTeam = (teamName) => {
    setSelectedTeams((prev) =>
      prev.includes(teamName)
        ? prev.filter((item) => item !== teamName)
        : [...prev, teamName],
    );
  };

  const toggleDepartment = (department) => {
    setSelectedDepartments((prev) =>
      prev.includes(department)
        ? prev.filter((item) => item !== department)
        : [...prev, department],
    );
  };

  const toggleCourse = (course) => {
    setSelectedCourses((prev) =>
      prev.includes(course)
        ? prev.filter((item) => item !== course)
        : [...prev, course],
    );
  };

  return (
    <div className="p-6">
      <div className="card-panel">
        {selectedIntern ? (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setSelectedIntern(null)}
              className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Back to Intern Management
            </button>

            <ProfileView
              user={selectedIntern}
              mode={role}
              onReturn={handleReturn}
            />
          </div>
        ) : (
          <>
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4">
          {/* Search Input */}
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search interns or teams..."
          />
          {/* Right Controls */}
          <div className="flex gap-2">
            {role === "hr-admin" && (
              <button className="px-4 py-2 bg-purple-500 text-white rounded-md">
                Export
              </button>
            )}
            {/* Filter Button */}
            <MyInternsFilterModal
              teams={teams}
              departments={departments}
              courses={courses}
              selectedTeams={selectedTeams}
              selectedDepartments={selectedDepartments}
              selectedCourses={selectedCourses}
              setSelectedTeams={setSelectedTeams}
              setSelectedDepartments={setSelectedDepartments}
              setSelectedCourses={setSelectedCourses}
              toggleTeam={toggleTeam}
              toggleDepartment={toggleDepartment}
              toggleCourse={toggleCourse}
            />
          </div>
        </div>

        {/* HR Staff Tabs */}
        {role === "hr-staff" && (
          <div className="flex gap-4 mb-4">
            <div
              onClick={() => setActiveTab("interns")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2  ${
                activeTab === "interns"
                  ? "border-violet-600 text-violet-600"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <User2 size={16} />
              <h2>Interns</h2>
            </div>
            <div
              onClick={() => setActiveTab("attendance")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2  ${
                activeTab === "attendance"
                  ? "border-violet-600 text-violet-600"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <CalendarRange size={16} />
              <h2>Attendance Request</h2>
            </div>
          </div>
        )}

        {/* Team Cards */}
        {selectedTeam ? (
          <TeamInternList
            teamName={selectedTeam}
            members={groupedInterns[selectedTeam] || []}
            onBack={() => setSelectedTeam(null)}
            onViewIntern={handleView}
            onDeleteIntern={handleDelete}
          />
        ) : Object.keys(groupedInterns).length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Object.entries(groupedInterns).map(([teamName, members]) => (
              <TeamCard
                key={teamName}
                teamName={teamName}
                members={members}
                onViewAll={() => setSelectedTeam(teamName)}
                onViewIntern={handleView}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white py-10 text-center">
            <p className="text-sm text-gray-400">No interns found.</p>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}
