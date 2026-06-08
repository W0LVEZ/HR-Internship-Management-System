import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";
import { getStoredDepartments } from "../../../common/utils/mockAuth.js";
import DepartmentCard from "../components/staff-management/DepartmentCard.jsx";
import SearchFilterBar from "../components/staff-management/SearchFilterBar.jsx";
import StaffPageShell from "../components/staff-management/StaffPageShell.jsx";
import { toDepartmentViews } from "../utils/staffManagementUtils.js";

export default function StaffManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [departments, setDepartments] = useState(() => {
    return toDepartmentViews(getStoredDepartments());
  });
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [newDeptTitle, setNewDeptTitle] = useState("");

  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [filterOption, setFilterOption] = useState("All"); // 'All', 'HasMembers', 'Empty'

  const handleAddDepartmentSubmit = (event) => {
    event.preventDefault();
    if (!newDeptTitle.trim()) return;

    const stored = getStoredDepartments();
    const exists = stored.some(
      (dept) => dept.title.toLowerCase() === newDeptTitle.trim().toLowerCase()
    );
    if (exists) {
      alert("A department with this name already exists.");
      return;
    }

    const newDept = {
      title: newDeptTitle.trim(),
      count: 0,
      members: [],
    };

    const nextStored = [...stored, newDept];
    localStorage.setItem("hrims_departments_db", JSON.stringify(nextStored));
    setDepartments(toDepartmentViews(nextStored));
    setNewDeptTitle("");
    setIsAddDeptOpen(false);
  };

  const filteredDepartments = useMemo(() => {
    let list = departments;

    if (filterOption === "HasMembers") {
      list = list.filter((dept) => dept.members.length > 0);
    } else if (filterOption === "Empty") {
      list = list.filter((dept) => dept.members.length === 0);
    }

    const query = search.toLowerCase().trim();

    if (!query) {
      return list;
    }

    return list.filter(department => {
      const departmentMatches = department.title
        .toLowerCase()
        .includes(query);

      const memberMatches = department.members.some(member => {
        return (
          member.name.toLowerCase().includes(query) ||
          member.role.toLowerCase().includes(query) ||
          (member.designation && member.designation.toLowerCase().includes(query))
        );
      });

      return departmentMatches || memberMatches;
    });
  }, [departments, search, filterOption]);

  function handleViewDepartment(department) {
    navigate(`/hr-staff/staff-management/${department.id}`);
  }

  function handleViewEmployee(department, employee) {
    navigate(`/hr-staff/staff-management/${department.id}/${employee.id}`);
  }

  return (
    <StaffPageShell
      title="Staff Management"
      subtitle="Permissions & Access Control"
    >
      <div className="rounded-xl border border-neutral-100 bg-white p-6 shadow-sm">
        <SearchFilterBar
          value={search}
          onChange={setSearch}
          placeholder="Search departments or employees"
          showFilter
          onFilterClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
          filterDropdown={
            isFilterDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-neutral-100 bg-white p-3 shadow-lg z-50">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Filter Departments</p>
                  {[
                    { value: "All", label: "All Departments" },
                    { value: "HasMembers", label: "Has Members" },
                    { value: "Empty", label: "Empty (0 Members)" },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer hover:bg-neutral-50 p-1 rounded">
                      <input
                        type="radio"
                        name="deptFilter"
                        checked={filterOption === opt.value}
                        onChange={() => {
                          setFilterOption(opt.value);
                          setIsFilterDropdownOpen(false);
                        }}
                        className="h-3.5 w-3.5 border-neutral-200 text-primary focus:ring-primary"
                      />
                      <span className="text-[12px] font-medium text-neutral-700">
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )
          }
          action={
            <button
              type="button"
              onClick={() => setIsAddDeptOpen(true)}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-[12px] font-medium text-white transition hover:bg-primary-hover shadow-sm cursor-pointer"
            >
              <Plus size={14} className="text-white" />
              Add New Dep't
            </button>
          }
        />

        {filteredDepartments.length === 0 ? (
          <div className="py-10 text-center text-[12px] text-neutral-400">
            No departments or employees found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {filteredDepartments.map(department => (
              <DepartmentCard
                key={department.id}
                department={department}
                onViewDepartment={() => handleViewDepartment(department)}
                onViewEmployee={employee => handleViewEmployee(department, employee)}
              />
            ))}
          </div>
        )}
      </div>

      {isAddDeptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <h2 className="text-base font-semibold text-slate-900 font-lexend">Add New Department</h2>
              <button
                type="button"
                onClick={() => setIsAddDeptOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddDepartmentSubmit} className="mt-4 space-y-4 font-lexend">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-500">Department Name</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engineering"
                  value={newDeptTitle}
                  onChange={(e) => setNewDeptTitle(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddDeptOpen(false)}
                  className="inline-flex h-11 min-w-24 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 min-w-28 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover cursor-pointer"
                >
                  Add Dept
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </StaffPageShell>
  );
}