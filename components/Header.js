export default function Header({ studentCount, isLoading }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            SM
          </span>
          <div className="leading-tight">
            <p className="text-base font-semibold text-slate-900">Student Manager</p>
            <p className="hidden text-xs text-slate-500 sm:block">Records dashboard</p>
          </div>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {isLoading ? "Loading…" : `${studentCount} ${studentCount === 1 ? "student" : "students"}`}
        </span>
      </nav>
    </header>
  );
}
