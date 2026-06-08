import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStoredDepartments } from "../../../common/utils/mockAuth.js";
import SearchFilterBar from "../components/staff-management/SearchFilterBar.jsx";
import StaffPageShell from "../components/staff-management/StaffPageShell.jsx";
import StaffTable from "../components/staff-management/StaffTable.jsx";
import {
  findDepartmentById,
  toDepartmentViews,
} from "../utils/staffManagementUtils.js";

const employeeColumns = [
  { key: "employeeId", label: "Employee ID" },
  { key: "name", label: "Employee Name" },
  { key: "designation", label: "Designation" },
  { key: "type", label: "Type" },
  { key: "numberOfInterns", label: "Number Of Interns" },
];

export default function StaffDepartmentPage() {
  const navigate = useNavigate();
  const { departmentId } = useParams();
  const [search, setSearch] = useState("");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [filterType, setFilterType] = useState("All"); // 'All', 'Office', 'Remote'

  const departments = useMemo(() => {
    return toDepartmentViews(getStoredDepartments());
  }, []);

  const department = findDepartmentById(departments, departmentId);

  const filteredEmployees = useMemo(() => {
    if (!department) {
      return [];
    }

    let list = department.members;

    if (filterType !== "All") {
      list = list.filter((e) => e.type === filterType);
    }

    const query = search.toLowerCase().trim();

    if (!query) {
      return list;
    }

    return list.filter(employee => {
      return (
        (employee.employeeId && employee.employeeId.toLowerCase().includes(query)) ||
        (employee.name && employee.name.toLowerCase().includes(query)) ||
        (employee.designation && employee.designation.toLowerCase().includes(query)) ||
        (employee.type && employee.type.toLowerCase().includes(query))
      );
    });
  }, [department, search, filterType]);

  function handleViewEmployee(employee) {
    navigate(`/hr-staff/staff-management/${department.id}/${employee.id}`);
  }

  if (!department) {
    return (
      <StaffPageShell title="Department Not Found" subtitle="Staff Management">
        <div className="rounded-xl border border-neutral-100 bg-white p-6 text-sm text-neutral-500 shadow-sm">
          The selected department could not be found.
        </div>
      </StaffPageShell>
    );
  }

  return (
    <StaffPageShell
      title={department.title}
      subtitle={`Staff Management > ${department.title}`}
    >
      <div className="rounded-xl border border-neutral-100 bg-white p-6 shadow-sm">
        <SearchFilterBar
          value={search}
          onChange={setSearch}
          placeholder="Search employees"
          showFilter
          onFilterClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
          filterDropdown={
            isFilterDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-neutral-100 bg-white p-3 shadow-lg z-50">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Filter Employees</p>
                  {[
                    { value: "All", label: "All Types" },
                    { value: "Office", label: "Office" },
                    { value: "Remote", label: "Remote" },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer hover:bg-neutral-50 p-1 rounded">
                      <input
                        type="radio"
                        name="empTypeFilter"
                        checked={filterType === opt.value}
                        onChange={() => {
                          setFilterType(opt.value);
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
        />

        <StaffTable
          columns={employeeColumns}
          rows={filteredEmployees}
          onView={handleViewEmployee}
          emptyMessage="No employees found."
        />
      </div>
    </StaffPageShell>
  );
}