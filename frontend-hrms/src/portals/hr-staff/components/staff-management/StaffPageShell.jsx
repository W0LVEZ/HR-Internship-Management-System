export default function StaffPageShell({ title, subtitle, children }) {
  return (
    <section className="min-h-screen bg-white px-8 py-7 font-lexend">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-[15px] font-semibold text-neutral-950">
            {title}
          </h1>

          <p className="mt-1 text-[10px] text-neutral-400">
            {subtitle}
          </p>
        </div>

        <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-100 bg-white text-neutral-700 shadow-sm">
          <span className="text-lg">⌕</span>
        </button>
      </div>

      {children}
    </section>
  )
}