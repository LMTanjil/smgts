"use client";

import { useEffect, useState } from "react";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  department: "",
};

export default function Home() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState({ type: "", message: "" });

  const fetchStudents = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/students", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load students.");
      }

      setStudents(data.data || []);
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message || "Unable to load students.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const loadStudents = async () => {
      setIsLoading(true);

      try {
        const response = await fetch("/api/students", {
          cache: "no-store",
          signal: controller.signal,
        });
        const data = await response.json();

        if (!controller.signal.aborted) {
          if (!response.ok) {
            throw new Error(data.message || "Unable to load students.");
          }

          setStudents(data.data || []);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setNotice({
            type: "error",
            message: error.message || "Unable to load students.",
          });
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadStudents();

    return () => {
      controller.abort();
    };
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setNotice({ type: "", message: "" });

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        department: form.department.trim(),
      };

      const endpoint = editingId ? `/api/students/${editingId}` : "/api/students";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "The request could not be completed.");
      }

      setNotice({
        type: "success",
        message: editingId ? "Student updated successfully." : "Student added successfully.",
      });

      setForm(initialForm);
      setEditingId(null);
      await fetchStudents();
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message || "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setForm({
      name: student.name,
      email: student.email,
      phone: student.phone,
      department: student.department,
    });
    setNotice({ type: "", message: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (studentId) => {
    const confirmed = window.confirm("Are you sure you want to delete this student?");

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete student.");
      }

      setNotice({
        type: "success",
        message: "Student deleted successfully.",
      });
      setEditingId(null);
      setForm(initialForm);
      await fetchStudents();
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message || "Unable to delete student.",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
    setNotice({ type: "", message: "" });
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 rounded-2xl bg-slate-900 px-6 py-5 text-white shadow-lg shadow-slate-200">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Dashboard</p>
              <h1 className="mt-2 text-3xl font-bold">Student Management System</h1>
            </div>
            <div className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-slate-200">
              {students.length} Active Students
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <section className="rounded-2xl bg-white p-6 shadow-md shadow-slate-200 ring-1 ring-slate-200">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">
                {editingId ? "Update Student" : "Add New Student"}
              </h2>
              {editingId ? (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:bg-slate-100"
                >
                  Cancel
                </button>
              ) : null}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="student@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="+1 234 567 890"
                  required
                />
              </div>

              <div>
                <label htmlFor="department" className="mb-2 block text-sm font-medium text-slate-700">
                  Department
                </label>
                <input
                  id="department"
                  name="department"
                  type="text"
                  value={form.department}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Computer Science"
                  required
                />
              </div>

              {notice.message ? (
                <div
                  className={`rounded-xl border px-3 py-2 text-sm ${
                    notice.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : notice.type === "error"
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  {notice.message}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {isSubmitting ? (editingId ? "Updating Student..." : "Saving Student...") : editingId ? "Update Student" : "Add Student"}
              </button>
            </form>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-md shadow-slate-200 ring-1 ring-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">Student Records</h2>
            </div>

            {isLoading ? (
              <div className="space-y-3 py-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-14 animate-pulse rounded-xl bg-slate-200" />
                ))}
              </div>
            ) : students.length === 0 ? (
              <div className="flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center text-slate-500">
                No students found. Add the first student record.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Email</th>
                      <th className="px-4 py-3 font-semibold">Phone</th>
                      <th className="px-4 py-3 font-semibold">Department</th>
                      <th className="px-4 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {students.map((student) => (
                      <tr key={student._id} className="align-top hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-800">{student.name}</td>
                        <td className="px-4 py-3">{student.email}</td>
                        <td className="px-4 py-3">{student.phone}</td>
                        <td className="px-4 py-3">{student.department}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(student)}
                              className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 font-medium text-blue-700 transition hover:bg-blue-100"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(student._id)}
                              className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 font-medium text-red-700 transition hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
