export const SORT_OPTIONS = {
  newest: { label: "Newest first", compare: (a, b) => b.createdAt.localeCompare(a.createdAt) },
  oldest: { label: "Oldest first", compare: (a, b) => a.createdAt.localeCompare(b.createdAt) },
  "name-asc": { label: "Name (A-Z)", compare: (a, b) => a.name.localeCompare(b.name) },
  "name-desc": { label: "Name (Z-A)", compare: (a, b) => b.name.localeCompare(a.name) },
};

export const DEFAULT_FILTERS = { query: "", department: "", sort: "newest" };

/** Apply search, department filter and sort to a student list. */
export function applyFilters(students, { query, department, sort }) {
  const q = query.trim().toLowerCase();
  return students
    .filter(
      (s) =>
        (!q || s.name.toLowerCase().includes(q) || s.email.includes(q)) &&
        (!department || s.department === department)
    )
    .sort(SORT_OPTIONS[sort].compare);
}

const controlClass =
  "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

export default function StudentToolbar({ filters, onChange, departments }) {
  const update = (key) => (event) => onChange({ ...filters, [key]: event.target.value });

  return (
    <div className="mb-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
      <label className="sr-only" htmlFor="student-search">Search students</label>
      <input
        id="student-search"
        type="search"
        value={filters.query}
        onChange={update("query")}
        placeholder="Search by name or email…"
        className={controlClass}
      />
      <label className="sr-only" htmlFor="department-filter">Filter by department</label>
      <select id="department-filter" value={filters.department} onChange={update("department")} className={controlClass}>
        <option value="">All departments</option>
        {departments.map((dept) => (
          <option key={dept} value={dept}>{dept}</option>
        ))}
      </select>
      <label className="sr-only" htmlFor="sort-order">Sort students</label>
      <select id="sort-order" value={filters.sort} onChange={update("sort")} className={controlClass}>
        {Object.entries(SORT_OPTIONS).map(([value, { label }]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  );
}
