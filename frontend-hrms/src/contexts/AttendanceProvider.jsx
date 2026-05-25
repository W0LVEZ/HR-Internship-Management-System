import { useState } from "react";
import dayjs from "dayjs";
import { AttendanceContext } from "./AttendanceContext";
import { useAuth } from "../contexts/AuthContext";
import { addSystemLog, LOG_TYPES } from "../common/utils/systemLogger";

export const AttendanceProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [attendanceDB, setAttendanceDB] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("attendance_db") || "{}");
    return stored;
  });

  //This will save to local storage
  // TODO: Replace localStorage attendance_db with backend API
  // Suggested endpoints:
  // GET /attendance/:userId
  // POST /attendance/time-in
  // POST /attendance/time-out
  const updateDB = (newDB) => {
    setAttendanceDB(newDB);
    localStorage.setItem("attendance_db", JSON.stringify(newDB));
  };

  //This will get the records of the current user
  const records = attendanceDB[currentUser?.id] || [];

  const WORK_START = 9; // 9 AM
  const LATE_LIMIT = 9 * 60 + 20; // 9:20 AM in minutes
  const EARLY_LIMIT = 8 * 60 + 40; // 8:40 AM in minutes
  const WORK_END = 18; // 6 PM
  const MAX_TIME_OUT = 18 * 60 + 20; // 6:20 PM in minutes
  const BREAK_TIME = 1; // 1 hour break

  //Helper toget the current date in MMMM DD, YYYY format, can be used for validations in the future
  const getToday = () => dayjs().format("MMMM DD, YYYY");

  //Helper to get today's record, can be used for validations in the future
  const getTodayRecord = () => records.find((rec) => rec.date === getToday());

  const timeIn = () => {
    if (!currentUser) return;

    const now = dayjs().startOf("minute");
    const minutesNow = now.hour() * 60 + now.minute();

    const existing = getTodayRecord();
    if (existing) {
      alert("You have already timed in today!");
      return;
    }

    if (minutesNow < EARLY_LIMIT) {
      alert("Too early to clock in!");
      return;
    }

    const isLate = minutesNow > LATE_LIMIT;

    const newRecord = {
      date: getToday(),
      timeIn: now.format("hh:mm A"),
      timeInRaw: now.toISOString(),
      timeOut: null,
      workinghours: null,
      status: isLate ? "Late" : "On Time",
    };

    // TODO: Replace with API call
    // Example:
    // await fetch("/attendance/time-in", { method: "POST", body: {...} })
    const update = {
      ...attendanceDB,
      [currentUser.id]: [...records, newRecord],
    };

    updateDB(update);
    addSystemLog({
      action: LOG_TYPES.TIME_IN,
      title: "Intern Timed In",
      description: `${currentUser.name} timed in at ${newRecord.timeIn}.`,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      audience: ["hr-admin"],
      supervisorId: currentUser.supervisorId,
      internId: currentUser.id,
    });
  };

  const timeOut = () => {
    if (!currentUser) return;

    const now = dayjs().startOf("minute");
    const todayRecord = getTodayRecord();
    if (!todayRecord) {
      return alert("You haven't timed in today!");
    }

    if (todayRecord.timeOut) {
      return alert("You have already timed out today!");
    }

    //if (minutesNow > MAX_TIME_OUT) {
    // return alert("Too late to clock out!");
    //}

    // TODO: Replace with API call
    // Example:
    // await fetch("/attendance/time-out", { method: "POST", body: {...} })
    const updateRecords = records.map((rec) => {
      if (rec.date === getToday()) {
        const parsedTimeIn = dayjs(rec.timeInRaw).startOf("minute");

        //Work in minutes
        const workedMinutes =
          now.diff(parsedTimeIn, "minute") - BREAK_TIME * 60;

        //Convert to Hours
        const workedHours = workedMinutes / 60;

        return {
          ...rec,
          timeOut: now.format("hh:mm A"),
          workinghours: workedHours > 0 ? workedHours.toFixed(2) : "0.00",
        };
      }
      return rec;
    });

    // TODO: Replace local update with backend API call
    // POST /attendance/time-out
    const updated = {
      ...attendanceDB,
      [currentUser.id]: updateRecords,
    };

    updateDB(updated);
    addSystemLog({
      action: LOG_TYPES.TIME_OUT,
      title: "Intern Timed Out",
      description: `${currentUser.name} timed out at ${now.format("hh:mm A")}.`,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      audience: ["hr-admin"],
      supervisorId: currentUser.supervisorId,
      internId: currentUser.id,
    });
  };

  // To check if Absent
  const getStatus = (rec) => {
    if (!rec.timeIn) return "Absent";
    return rec.status;
  };

  //This will get the records for HR view
  const getRecordsByUser = (userId) => {
    return attendanceDB[userId] || [];
  };

  const updateAttendanceRecord = (userId, recordIndex, updatedRecord) => {
    const userRecords = attendanceDB[userId] || [];
    const updatedRecords = userRecords.map((record, index) =>
      index === recordIndex ? { ...record, ...updatedRecord } : record,
    );

    updateDB({
      ...attendanceDB,
      [userId]: updatedRecords,
    });
  };

  return (
    <AttendanceContext.Provider
      value={{
        records,
        timeIn,
        timeOut,
        getStatus,
        getRecordsByUser,
        updateAttendanceRecord,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};
