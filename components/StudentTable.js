function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function Avatar({ name }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700">
      {initials(name)}
    </span>
  );
}

function RowActions({ student, isEditing, onEdit, onDelete }) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onEdit(student)}
        aria-label={`Edit ${student.name}`}
        className={`rounded-md px-3 py-1.5 text-sm font-medium ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
          isEditing
            ? "bg-indigo-600 text-white ring-indigo-600"
            : "bg-white text-slate-700 ring-slate-300 hover:bg-slate-50"
        }`}
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => onDelete(student)}
        aria-label={`Delete ${student.name}`}
        className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-red-600 ring-1 ring-red-200 transition hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
      >
        Delete
      </button>
    </div>
  );
}

/** Student list: a table on md+ screens and stacked cards on mobile. */
export default function StudentTable({ students, editingId, onEdit, onDelete }) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="px-3 py-3 font-medium">Student</th>
              <th scope="col" className="px-3 py-3 font-medium">Phone</th>
              <th scope="col" className="px-3 py-3 font-medium">Department</th>
              <th scope="col" className="px-3 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => (
              <tr
                key={student._id}
                className={student._id === editingId ? "bg-indigo-50/60" : "hover:bg-slate-50"}
              >
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={student.name} />
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">{student.name}</p>
                      <p className="break-words text-slate-500">{student.email}</p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-slate-600">{student.phone}</td>
                <td className="px-3 py-3">
                  <span className="inline-block rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                    {student.department}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex justify-end">
                    <RowActions
                      student={student}
                      isEditing={student._id === editingId}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {students.map((student) => (
          <li
            key={student._id}
            className={`rounded-lg p-4 ring-1 ${
              student._id === editingId ? "bg-indigo-50/60 ring-indigo-200" : "ring-slate-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <Avatar name={student.name} />
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">{student.name}</p>
                <p className="text-xs text-slate-500">{student.department}</p>
              </div>
            </div>
            <dl className="mt-3 space-y-1 text-sm">
              <div className="flex gap-2">
                <dt className="w-14 shrink-0 text-slate-500">Email</dt>
                <dd className="min-w-0 break-all text-slate-700">{student.email}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-14 shrink-0 text-slate-500">Phone</dt>
                <dd className="text-slate-700">{student.phone}</dd>
              </div>
            </dl>
            <div className="mt-3">
              <RowActions
                student={student}
                isEditing={student._id === editingId}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
