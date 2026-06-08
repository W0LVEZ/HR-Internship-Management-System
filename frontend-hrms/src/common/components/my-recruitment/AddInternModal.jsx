import { useState, useEffect } from "react";
import { X, UserPlus } from "lucide-react";

export default function AddInternModal({ onClose, onSave }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("");
  const [course, setCourse] = useState("");
  const [hours, setHours] = useState("300");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [department, setDepartment] = useState("Information Technology");
  const [supervisorId, setSupervisorId] = useState("");
  const [supervisors, setSupervisors] = useState([]);

  useEffect(() => {
    // Load supervisors from mock database
    const db = JSON.parse(localStorage.getItem("hrims_users_db") || "{}");
    const sups = Object.values(db).filter((u) => u.role === "SUPERVISOR");
    setSupervisors(sups);
    if (sups.length > 0) {
      setSupervisorId(sups[0].id);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !university || !course) {
      alert("Please fill in all required fields.");
      return;
    }

    const newIntern = {
      id: `intern_${Date.now()}`,
      role: "INTERN",
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      email,
      phone,
      university,
      course,
      hours: `${hours} hours`,
      duration: `${startDate || "2026-06-01"} - ${endDate || "2026-09-01"}`,
      department,
      supervisorId,
      maritalStatus: "Single",
      gender: "Male",
      nationality: "Filipino",
      address: "123 Academic Road",
      city: "Manila",
      zipCode: "1000",
      year: "4th Year",
      graduation: "2026",
    };

    // Save to localStorage
    const db = JSON.parse(localStorage.getItem("hrims_users_db") || "{}");
    db[newIntern.id] = newIntern;
    localStorage.setItem("hrims_users_db", JSON.stringify(db));

    onSave?.(newIntern);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-[650px] rounded-2xl bg-white shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-violet-600">
            <UserPlus size={20} />
            <h2 className="text-lg font-bold text-gray-950">Add New Intern</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition"
            aria-label="Close add intern modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-xs font-semibold text-gray-700 mb-1.5">First Name *</span>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className="w-full h-11 rounded-lg border border-gray-200 px-4 text-sm text-gray-700 outline-none focus:border-violet-400"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-gray-700 mb-1.5">Last Name *</span>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className="w-full h-11 rounded-lg border border-gray-200 px-4 text-sm text-gray-700 outline-none focus:border-violet-400"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address *</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full h-11 rounded-lg border border-gray-200 px-4 text-sm text-gray-700 outline-none focus:border-violet-400"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-gray-700 mb-1.5">Contact Number</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 09171234567"
                className="w-full h-11 rounded-lg border border-gray-200 px-4 text-sm text-gray-700 outline-none focus:border-violet-400"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
            <label className="block">
              <span className="block text-xs font-semibold text-gray-700 mb-1.5">University *</span>
              <input
                type="text"
                required
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="University Name"
                className="w-full h-11 rounded-lg border border-gray-200 px-4 text-sm text-gray-700 outline-none focus:border-violet-400"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-gray-700 mb-1.5">Course / Program *</span>
              <input
                type="text"
                required
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="BS Information Technology"
                className="w-full h-11 rounded-lg border border-gray-200 px-4 text-sm text-gray-700 outline-none focus:border-violet-400"
              />
            </label>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <label className="block">
              <span className="block text-xs font-semibold text-gray-700 mb-1.5">Required Hours</span>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="300"
                className="w-full h-11 rounded-lg border border-gray-200 px-4 text-sm text-gray-700 outline-none focus:border-violet-400"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-gray-700 mb-1.5">Start Date</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm text-gray-700 outline-none focus:border-violet-400 bg-white"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-gray-700 mb-1.5">End Date</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm text-gray-700 outline-none focus:border-violet-400 bg-white"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
            <label className="block">
              <span className="block text-xs font-semibold text-gray-700 mb-1.5">Assigned Department</span>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm text-gray-700 outline-none focus:border-violet-400 bg-white"
              >
                <option value="Information Technology">Information Technology</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
              </select>
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-gray-700 mb-1.5">Assigned Supervisor</span>
              <select
                value={supervisorId}
                onChange={(e) => setSupervisorId(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm text-gray-700 outline-none focus:border-violet-400 bg-white"
              >
                {supervisors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.department})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-violet-600 text-sm font-semibold text-white hover:bg-violet-700 transition"
            >
              Add Intern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
