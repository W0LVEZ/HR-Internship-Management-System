import { useMemo, useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { PlusCircle, Search } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import TaskManagementPage from "../../../common/components/tasks/TaskManagementPage";
import AssignTaskModal from "../components/ui/AssignTaskModal";
import ProfileHeader from "../../../common/components/profile/ProfileHeader";

export default function SupervisorTasks() {
  const { currentUser } = useAuth();
  const { setPageHeader } = useOutletContext();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInternId, setSelectedInternId] = useState(null);

  const [usersDb, setUsersDb] = useState(() => {
    try {
      const storedUsers = localStorage.getItem("hrims_users_db");
      return storedUsers ? JSON.parse(storedUsers) : {};
    } catch (error) {
      console.log("Failed to load users DB:", error);
      return {};
    }
  });

  // Get interns under this supervisor
  const interns = useMemo(() => {
    return Object.values(usersDb).filter(
      (user) =>
        user?.role === "INTERN" && user?.supervisorId === currentUser?.id,
    );
  }, [usersDb, currentUser]);

  // Get all tasks from all interns under this supervisor
  const allTaskRows = useMemo(() => {
    return interns.flatMap((intern) =>
      (intern.tasks || []).map((task) => ({
        ...task,
        internId: intern.id,
        internName: intern.name,
        internEmail: intern.email,
        internDepartment: intern.department,
        internCourse: intern.course,
      })),
    );
  }, [interns]);

  // Search all tasks table
  const filteredTaskRows = allTaskRows.filter((task) => {
    const search = searchTerm.toLowerCase();

    return (
      (task.taskName || task.title || "").toLowerCase().includes(search) ||
      (task.internName || "").toLowerCase().includes(search) ||
      (task.deadline || "").toLowerCase().includes(search) ||
      (task.status || "").toLowerCase().includes(search)
    );
  });

  const selectedIntern = usersDb[selectedInternId];
  const selectedInternTasks = selectedIntern?.tasks || [];

  // Update task anywhere in usersDb
  const updateTask = (taskId, updatedFields) => {
    const updatedUsersDb = { ...usersDb };

    Object.keys(updatedUsersDb).forEach((userId) => {
      const user = updatedUsersDb[userId];

      if (user?.role !== "INTERN" || !user.tasks) return;

      updatedUsersDb[userId] = {
        ...user,
        tasks: user.tasks.map((task) =>
          task.id === taskId ? { ...task, ...updatedFields } : task,
        ),
      };
    });

    setUsersDb(updatedUsersDb);
    localStorage.setItem("hrims_users_db", JSON.stringify(updatedUsersDb));
  };

  // Assign task to selected interns
  const handleAssignTask = (selectedInternIds, newTask) => {
    const updatedUsersDb = { ...usersDb };

    selectedInternIds.forEach((internId) => {
      const intern = updatedUsersDb[internId];

      if (!intern) return;

      updatedUsersDb[internId] = {
        ...intern,
        tasks: [...(intern.tasks || []), newTask],
      };
    });

    setUsersDb(updatedUsersDb);
    localStorage.setItem("hrims_users_db", JSON.stringify(updatedUsersDb));
    setIsOpen(false);
  };

  const getStatusClass = (status) => {
    if (status === "Completed") return "bg-green-100 text-green-600";
    if (status === "In Progress") return "bg-yellow-100 text-yellow-600";
    if (status === "Overdue") return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-600";
  };

  const getDeliverableName = (deliverable) => {
    if (!deliverable || deliverable === "Not uploaded") return "Not uploaded";
    if (typeof deliverable === "string") return deliverable;
    return deliverable.fileName || "Not uploaded";
  };

  useEffect(() => {
    if (selectedIntern) {
      setPageHeader({
        title: selectedIntern.name,
        subtitle: `Task Manager > ${selectedIntern.name}`,
        showBack: true,
        onclick: () => setSelectedInternId(null),
      });
      return;
    }

    //default page headr
    setPageHeader(null);
    return () => setPageHeader(null);
  }, [selectedIntern, setPageHeader]);

  return (
    <>
      {/* CREATE TASK MODAL */}
      {isOpen && (
        <AssignTaskModal
          interns={interns}
          onClose={() => setIsOpen(false)}
          onAssign={handleAssignTask}
        />
      )}

      {/* SELECTED INTERN TASK VIEW */}
      {selectedInternId && selectedIntern ? (
        <div className="space-y-5">
          {/* Intern profile card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <ProfileHeader
              user={selectedIntern}
              mode="SUPERVISOR"
              hideAction={true}
            />

            {/* Intern-specific task page */}
            <TaskManagementPage
              tasks={selectedInternTasks}
              currentUser={currentUser}
              mode="supervisor"
              onUpdateTask={updateTask}
              showBackButton={false}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          {/* TOP BAR */}
          <div className="mb-6 flex items-center justify-between">
            {/* Search */}
            <div className="relative w-80">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                placeholder="Search tasks or interns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Create New Task */}
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-hover"
            >
              <PlusCircle size={16} />
              Create New Task
            </button>
          </div>

          {/* ALL TASKS TABLE */}
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 text-xs text-gray-400">
              <tr>
                <th className="px-4 py-3 font-medium">Task</th>
                <th className="px-4 py-3 font-medium">Intern Name</th>
                <th className="px-4 py-3 font-medium">Deadline</th>
                <th className="px-4 py-3 font-medium">Deliverable</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredTaskRows.length > 0 ? (
                filteredTaskRows.map((task) => (
                  <tr
                    key={`${task.internId}-${task.id}`}
                    onClick={() => setSelectedInternId(task.internId)}
                    className="cursor-pointer transition hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">{task.taskName || task.title}</td>

                    <td className="px-4 py-3">{task.internName}</td>

                    <td className="px-4 py-3">{task.deadline || "-"}</td>

                    <td className="px-4 py-3">
                      {getDeliverableName(task.deliverable)}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-md px-2 py-1 text-xs ${getStatusClass(
                          task.status || "In Progress",
                        )}`}
                      >
                        {task.status || "In Progress"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400">
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
