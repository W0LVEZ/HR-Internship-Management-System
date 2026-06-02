export default function EmployeeRow({ employee, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-1 py-2 text-left transition hover:bg-neutral-50"
    >
      <img
        src={employee.avatar}
        alt={employee.name}
        className="h-9 w-9 rounded-full object-cover"
      />

      <span className="flex-1 text-[12px] text-neutral-800">
        {employee.name}
      </span>

      <span className="text-lg leading-none text-neutral-900">
        ›
      </span>
    </button>
  )
}