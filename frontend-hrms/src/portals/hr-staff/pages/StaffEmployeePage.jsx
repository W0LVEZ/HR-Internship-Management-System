import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getStoredDepartments } from "../../../common/utils/mockAuth.js";
import SearchFilterBar from "../components/staff-management/SearchFilterBar.jsx";
import StaffPageShell from "../components/staff-management/StaffPageShell.jsx";
import StaffTable from "../components/staff-management/StaffTable.jsx";
import {
  findDepartmentById,
  findEmployeeById,
  getInternsForEmployee,
  toDepartmentViews,
} from "../utils/staffManagementUtils.js";

const internColumns = [
  { key: "name", label: "Intern Name" },
  { key: "dateAssigned", label: "Date Assigned" },
  { key: "ojtHours", label: "OJT Hours" },
  { key: "hoursRendered", label: "Hours Rendered" },
];

export default function StaffEmployeePage() {
  const { departmentId, employeeId } = useParams();
  const [search, setSearch] = useState("");

  const departments = useMemo(() => {
    return toDepartmentViews(getStoredDepartments());
  }, []);

  const department = findDepartmentById(departments, departmentId);
  const employee = findEmployeeById(department, employeeId);
  const interns = getInternsForEmployee(employee);

  const filteredInterns = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return interns;
    }

    return interns.filter(intern => {
      return (
        intern.name?.toLowerCase().includes(query) ||
        intern.dateAssigned?.toLowerCase().includes(query) ||
        intern.ojtHours?.toLowerCase().includes(query) ||
        intern.hoursRendered?.toLowerCase().includes(query)
      );
    });
  }, [interns, search]);

  function handleViewIntern(intern) {
    console.log("View intern:", intern);
  }

  if (!department || !employee) {
    return (
      <StaffPageShell title="Employee Not Found" subtitle="Staff Management">
        <div className="rounded-xl border border-neutral-100 bg-white p-6 text-sm text-neutral-500 shadow-sm">
          The selected employee could not be found.
        </div>
      </StaffPageShell>
    );
  }

  return (
    <StaffPageShell
      title={employee.name}
      subtitle={`Staff Management > ${department.title} > ${employee.name}`}
    >
      <div className="rounded-xl border border-neutral-100 bg-white p-6 shadow-sm">
        <SearchFilterBar
          value={search}
          onChange={setSearch}
          placeholder="Search interns"
          showFilter
          action={
            <button
              type="button"
              className="h-11 rounded-lg bg-primary px-5 text-[12px] font-medium text-white transition hover:bg-primary-hover"
            >
              + Add New Intern
            </button>
          }
        />

        <StaffTable
          columns={internColumns}
          rows={filteredInterns}
          onView={handleViewIntern}
          emptyMessage="No interns found."
        />
      </div>
    </StaffPageShell>
  );
}