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

  const departments = useMemo(() => {
    return toDepartmentViews(getStoredDepartments());
  }, []);

  const department = findDepartmentById(departments, departmentId);

  const filteredEmployees = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!department) {
      return [];
    }

    if (!query) {
      return department.members;
    }

    return department.members.filter(employee => {
      return (
        employee.employeeId.toLowerCase().includes(query) ||
        employee.name.toLowerCase().includes(query) ||
        employee.designation.toLowerCase().includes(query) ||
        employee.type.toLowerCase().includes(query)
      );
    });
  }, [department, search]);

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