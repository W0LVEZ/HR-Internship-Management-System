import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

import TeamCard from "./TeamCard";
import MyInternsFilterModal from "./MyInternsFilterModal";
import TeamInternList from "./TeamInternList";
import SearchInput from "../ui/SearchInput";

import { User2, CalendarRange, Plus, X, Users as UsersIcon, Briefcase, FileText, Hash } from "lucide-react";

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

  //Filters for team card view
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [teamFormData, setTeamFormData] = useState({
    teamName: '',
    department: 'Information Technology',
    teamLeader: '',
    teamDescription: '',
    maxMembers: '',
  });

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

    const matchesSearch =
      (intern.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (intern.id || "").toLowerCase().includes(search.toLowerCase());

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
    console.log("Clicked Intern: ", intern);
    navigate("/intern/profile", { state: { intern } });
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

  const handleTeamFormChange = (e) => {
    const { name, value } = e.target;
    setTeamFormData((prev) => ({ ...prev, [name]: value }));
  };

  const closeCreateTeamModal = () => {
    setIsCreateTeamModalOpen(false);
    setTeamFormData({
      teamName: '',
      department: 'Information Technology',
      teamLeader: '',
      teamDescription: '',
      maxMembers: '',
    });
  };

  const handleCreateTeam = (e) => {
    e.preventDefault();
    closeCreateTeamModal();
  };

  return (
    <div className="p-6">
      <div className="card-panel">
        {/* Create Team Modal */}
        {isCreateTeamModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm"
            onClick={closeCreateTeamModal}
          >
            <div
              className="w-full max-w-2xl rounded-[28px] border border-violet-100 bg-white p-5 shadow-2xl shadow-violet-100/70 transition-all duration-300 sm:p-7"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 mb-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-500">New Team</p>
                  <h3 className="mt-1 text-2xl font-semibold text-slate-900">Create Team</h3>
                  <p className="mt-2 text-sm text-slate-500">Set up a new team for organizing interns.</p>
                </div>
                <button
                  type="button"
                  onClick={closeCreateTeamModal}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>

              <form className="space-y-5" onSubmit={handleCreateTeam}>
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Team Name */}
                  <div className="md:col-span-2">
                    <label htmlFor="teamName" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <UsersIcon size={16} className="text-violet-500" />
                      Team Name
                    </label>
                    <input
                      id="teamName"
                      name="teamName"
                      value={teamFormData.teamName}
                      onChange={handleTeamFormChange}
                      placeholder="Enter team name"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                      required
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label htmlFor="department" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Briefcase size={16} className="text-violet-500" />
                      Department
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={teamFormData.department}
                      onChange={handleTeamFormChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                    >
                      <option>Information Technology</option>
                      <option>Marketing</option>
                      <option>Human Resources</option>
                      <option>Finance</option>
                      <option>Operations</option>
                      <option>Other</option>
                    </select>
                  </div>

                  {/* Team Leader */}
                  <div>
                    <label htmlFor="teamLeader" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <UsersIcon size={16} className="text-violet-500" />
                      Team Leader
                    </label>
                    <input
                      id="teamLeader"
                      name="teamLeader"
                      value={teamFormData.teamLeader}
                      onChange={handleTeamFormChange}
                      placeholder="Enter team leader name"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                      required
                    />
                  </div>

                  {/* Maximum Members */}
                  <div>
                    <label htmlFor="maxMembers" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Hash size={16} className="text-violet-500" />
                      Maximum Members
                    </label>
                    <input
                      id="maxMembers"
                      name="maxMembers"
                      type="number"
                      min="1"
                      value={teamFormData.maxMembers}
                      onChange={handleTeamFormChange}
                      placeholder="Enter max members"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                      required
                    />
                  </div>

                  {/* Team Description */}
                  <div className="md:col-span-2">
                    <label htmlFor="teamDescription" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <FileText size={16} className="text-violet-500" />
                      Team Description
                    </label>
                    <textarea
                      id="teamDescription"
                      name="teamDescription"
                      value={teamFormData.teamDescription}
                      onChange={handleTeamFormChange}
                      placeholder="Enter team description"
                      rows="4"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 resize-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeCreateTeamModal}
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
                  >
                    Create Team
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4">
          {/* Search Input */}
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search interns..."
          />
          {/* Right Controls */}
          <div className="flex gap-2">
            {role === "hr-admin" && (
              <button className="px-4 py-2 bg-purple-500 text-white rounded-md">
                Export
              </button>
            )}
            {/* Create Team Button */}
            <button
              onClick={() => setIsCreateTeamModalOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 shadow-sm"
            >
              <Plus size={16} />
              Create Team
            </button>
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
      </div>
    </div>
  );
}
