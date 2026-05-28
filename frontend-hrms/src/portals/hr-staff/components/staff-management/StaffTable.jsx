function EyeIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

export default function StaffTable({ columns, rows, onView }) {
  return (
    <div className="overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-100">
            {columns.map(column => (
              <th
                key={column.key}
                className="pb-4 text-left text-[11px] font-normal text-neutral-400"
              >
                {column.label}
              </th>
            ))}

            <th className="pb-4 text-left text-[11px] font-normal text-neutral-400">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map(row => (
            <tr
              key={row.id}
              className="border-b border-neutral-100 last:border-b-0"
            >
              {columns.map(column => (
                <td
                  key={column.key}
                  className="py-4 text-[12px] text-neutral-800"
                >
                  {row[column.key]}
                </td>
              ))}

              <td className="py-4">
                <div className="flex items-center gap-3 text-neutral-800">
                  <button
                    type="button"
                    onClick={() => onView?.(row)}
                    className="transition hover:text-primary"
                  >
                    <EyeIcon />
                  </button>

                  <button
                    type="button"
                    className="transition hover:text-primary"
                  >
                    <EditIcon />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}