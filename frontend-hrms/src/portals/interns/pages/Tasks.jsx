import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import FileDropzone from "../../../common/components/ui/FileDropZone";
import {
  getTodayISO,
  formatDateForDisplay,
} from "../../../common/utils/dateHelper";

export default function Tasks() {
  const { currentUser } = useAuth();

  const [usersDb, setUsersDb] = useState(() => {
    try {
      const storedUsers = localStorage.getItem("hrims_users_db");
      return storedUsers ? JSON.parse(storedUsers) : {};
    } catch (error) {
      console.log("Failed to load users DB: ", error);
      return {};
    }
  });

  const intern = usersDb[currentUser?.id];
  const tasks = intern?.tasks || [];

  const updateTask = (taskId, updatedFields) => {
    const updatedUsersDb = { ...usersDb };

    updatedUsersDb[currentUser?.id] = {
      ...updatedUsersDb[currentUser.id],
      tasks: (updatedUsersDb[currentUser.id].tasks || []).map((task) =>
        task.id === taskId ? { ...task, ...updatedFields } : task,
      ),
    };

    setUsersDb(updatedUsersDb);
    localStorage.setItem("hrims_users_db", JSON.stringify(updatedUsersDb));
  };

  const handlePostComment = () => {
    if (!commentText.trim() || !selectedTask) return;

    const newComment = {
      id: crypto.randomUUID(),
      author: currentUser?.name || "You",
      message: commentText,
    };

    updateTask(selectedTask.id, {
      comments: [...(selectedTask.comments || []), newComment],
    });

    setCommentText("");
  };

  const handleSubmitWork = () => {
    if (!uploadedFile || !selectedTask) return;

    updateTask(selectedTask.id, {
      deliverable: uploadedFile,
      status: "Completed",
      submitted: getTodayISO(),
      finishDate: getTodayISO(),
    });

    setUploadedFile("");
  };

  const getProgress = () => {
    return selectedTask?.status === "Completed" ? 100 : 0;
  };

  if (!currentUser) return null;

  return (
    <TaskManagementPage
      tasks={tasks}
      currentUser={currentUser}
      mode="intern"
      onUpdateTask={updateTask}
    />
  );
}
