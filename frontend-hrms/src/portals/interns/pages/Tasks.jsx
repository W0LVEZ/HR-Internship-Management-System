import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import TaskManagementPage from "../../../common/components/tasks/TaskManagementPage";

export default function Tasks() {
  const { currentUser } = useAuth();

  // Load localStorage database
  const [usersDb, setUsersDb] = useState(() => {
    try {
      const storedUsers = localStorage.getItem("hrims_users_db");

      return storedUsers ? JSON.parse(storedUsers) : {};
    } catch (error) {
      console.log("Failed to load users DB:", error);
      return {};
    }
  });

  // Prevent crash while auth is loading
  if (!currentUser) return null;

  // Current intern
  const intern = usersDb[currentUser.id];

  // Intern tasks
  const tasks = intern?.tasks || [];

  // Reusable task updater
  const updateTask = (taskId, updatedFields) => {
    const updatedUsersDb = { ...usersDb };

    updatedUsersDb[currentUser.id] = {
      ...updatedUsersDb[currentUser.id],

      tasks: (updatedUsersDb[currentUser.id]?.tasks || []).map((task) =>
        task.id === taskId ? { ...task, ...updatedFields } : task,
      ),
    };

    // Update state
    setUsersDb(updatedUsersDb);

    // Save to localStorage
    localStorage.setItem("hrims_users_db", JSON.stringify(updatedUsersDb));
  };

  return (
    <TaskManagementPage
      tasks={tasks}
      currentUser={currentUser}
      mode="intern"
      onUpdateTask={updateTask}
    />
  );
}
