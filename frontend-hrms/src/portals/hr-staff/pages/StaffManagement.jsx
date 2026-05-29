import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredDepartments } from "../../../common/utils/mockAuth.js";
import DepartmentCard from "../components/staff-management/DepartmentCard.jsx";
import SearchFilterBar from "../components/staff-management/SearchFilterBar.jsx";
import StaffPageShell from "../components/staff-management/StaffPageShell.jsx";
import { toDepartmentViews } from "../utils/staffManagementUtils.js";

export default function StaffManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const departments = useMemo(() => {
    return toDepartmentViews(getStoredDepartments());
  }, []);

  const filteredDepartments = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return departments;
    }

    return departments.filter(department => {
      const departmentMatches = department.title
        .toLowerCase()
        .includes(query);

      const memberMatches = department.members.some(member => {
        return (
          member.name.toLowerCase().includes(query) ||
          member.role.toLowerCase().includes(query) ||
          member.designation.toLowerCase().includes(query)
        );
      });

      return departmentMatches || memberMatches;
    });
  }, [departments, search]);

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
    </StaffPageShell>
  );
}