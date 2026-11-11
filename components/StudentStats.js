function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 truncate text-2xl font-semibold text-slate-900">{value}</p>
      {hint ? <p className="mt-0.5 truncate text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

/** Summary cards plus a per-department breakdown, derived from the loaded list. */
export default function StudentStats({ students }) {
  const counts = new Map();
  for (const s of students) counts.set(s.department, (counts.get(s.department) || 0) + 1);
  const byDepartment = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const [topName, topCount] = byDepartment[0] || ["-", 0];

  const latest = students.reduce(
    (newest, s) => (!newest || s.createdAt > newest.createdAt ? s : newest),
    null
  );

  return (
    <section aria-label="Student statistics" className="mb-6 space-y-3">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total students" value={students.length} />
        <StatCard label="Departments" value={byDepartment.length} />
        <StatCard
          label="Largest department"
          value={topName}
          hint={topCount ? `${topCount} ${topCount === 1 ? "student" : "students"}` : null}
        />
        <StatCard label="Latest addition" value={latest?.name ?? "-"} hint={latest?.department} />
      </div>

      {byDepartment.length > 0 ? (
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">Students by department</p>
          <ul className="space-y-2">
            {byDepartment.map(([name, count]) => (
              <li key={name} className="grid grid-cols-[minmax(0,10rem)_1fr_2rem] items-center gap-3 text-sm">
                <span className="truncate text-slate-700">{name}</span>
                <span className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <span
                    className="block h-full rounded-full bg-indigo-500"
                    style={{ width: `${(count / students.length) * 100}%` }}
                  />
                </span>
                <span className="text-right font-medium tabular-nums text-slate-900">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
