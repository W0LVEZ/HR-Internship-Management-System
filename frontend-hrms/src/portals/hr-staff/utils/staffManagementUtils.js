export function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createInitials(name = "") {
  const parts = name.trim().split(" ");

  if (parts.length === 1) {
    return parts[0]?.charAt(0).toUpperCase() || "?";
  }

  return `${parts[0]?.charAt(0) || ""}${parts[parts.length - 1]?.charAt(0) || ""}`.toUpperCase();
}

export function createEmployeeId(departmentTitle, member, index) {
  if (member.id) {
    return String(member.id);
  }

  return `${slugify(departmentTitle)}-${slugify(member.name)}-${index + 1}`;
}

export function toDepartmentView(department) {
  return {
    id: slugify(department.title),
    title: department.title,
    count: department.count,
    members: department.members.map((member, index) => ({
      id: createEmployeeId(department.title, member, index),
      employeeId: member.id || String(345321231 + index),
      name: member.name,
      role: member.role || "Employee",
      designation: member.role || "Employee",
      type: member.type || "Office",
      email: member.email || "—",
      phone: member.phone || "—",
      numberOfInterns: member.numberOfInterns || member.interns?.length || 0,
      initials: createInitials(member.name),
      raw: member,
    })),
    raw: department,
  };
}

export function toDepartmentViews(departments) {
  return departments.map(toDepartmentView);
}

export function findDepartmentById(departments, departmentId) {
  return departments.find(department => department.id === departmentId);
}

export function findEmployeeById(department, employeeId) {
  return department?.members.find(member => member.id === employeeId);
}

export function getInternsForEmployee(employee) {
  return employee?.raw?.interns || [];
}