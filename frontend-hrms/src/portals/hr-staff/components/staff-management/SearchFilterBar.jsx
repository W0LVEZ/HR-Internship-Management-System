function SearchIcon() {
  return (
    <svg
      className="h-4 w-4 text-neutral-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 6h18" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  );
}

export default function SearchFilterBar({
  value,
  onChange,
  placeholder = "Search",
  showFilter = false,
  action,
}) {
  return (
    <div className="mb-7 flex items-center justify-between gap-4">
      <div className="relative w-full max-w-[290px]">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
          <SearchIcon />
        </div>

        <input
          type="text"
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border border-neutral-100 bg-white pl-11 pr-4 text-[12px] text-neutral-700 outline-none transition placeholder:text-neutral-300 focus:border-primary"
        />
      </div>

      <div className="flex items-center gap-3">
        {action}

        {showFilter && (
          <button className="flex h-11 items-center gap-2 rounded-lg border border-neutral-100 bg-white px-5 text-[12px] font-medium text-neutral-800 transition hover:bg-neutral-50">
            <FilterIcon />
            Filter
          </button>
        )}
      </div>
    </div>
  );
}