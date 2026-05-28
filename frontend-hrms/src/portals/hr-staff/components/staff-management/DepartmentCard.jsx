import EmployeeRow from './EmployeeRow'

export default function DepartmentCard({ 
  department, 
  onViewDepartment, 
  onViewEmployee 
}) {

  const members = department.members || [];
  const memberCount = department.count || members.length;

  return (
    <div className="rounded-xl border border-neutral-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-neutral-950">
            {department.title}
          </h2>

          <p className="mt-1 text-[10px] text-neutral-400">
            {memberCount} Members
          </p>
        </div>

        <button
          type="button"
          onClick={onViewDepartment}
          className="text-[11px] font-medium text-neutral-900 transition hover:text-primary"
        >
          View All
        </button>
      </div>

      <div className="space-y-1">
        {(department.members || []).slice(0, 5).map(employee => (
          <EmployeeRow
            key={employee.id}
            employee={employee}
            onClick={() => onViewEmployee(employee)}
          />
        ))}
      </div>
    </div>
  )
}