"use client";

import { useCallback, useEffect, useState } from "react";
import Header from "./Header";
import StudentForm from "./StudentForm";
import StudentStats from "./StudentStats";
import StudentTable from "./StudentTable";
import StudentToolbar, { DEFAULT_FILTERS, applyFilters } from "./StudentToolbar";
import ConfirmDialog from "./ConfirmDialog";
import Spinner from "./Spinner";
import { ToastStack, useToasts } from "./Toasts";
import { studentApi } from "@/lib/studentApi";

function ListSkeleton() {
  return (
    <div className="space-y-3" aria-label="Loading students">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="h-14 animate-pulse rounded-lg bg-slate-100" />
      ))}
    </div>
  );
}

function ListMessage({ title, description, action, tone = "neutral" }) {
  return (
    <div
      className={`flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed px-6 py-10 text-center ${
        tone === "error" ? "border-red-200 bg-red-50/50" : "border-slate-300 bg-slate-50"
      }`}
    >
      <p className={`font-medium ${tone === "error" ? "text-red-700" : "text-slate-800"}`}>{title}</p>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export default function StudentDashboard() {
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [loadError, setLoadError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { toasts, notify, dismiss } = useToasts();

  const departments = [...new Set(students.map((s) => s.department))].sort((a, b) =>
    a.localeCompare(b)
  );
  // If the selected department no longer exists (e.g. last student deleted), show all.
  if (filters.department && !departments.includes(filters.department)) {
    setFilters({ ...filters, department: "" });
  }

  const applyList = useCallback((payload) => {
    setStudents(payload.data);
    setStatus("ready");
    setLoadError("");
  }, []);

  const applyListError = useCallback((error) => {
    setLoadError(error.message);
    setStatus("error");
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    studentApi
      .list(controller.signal)
      .then(applyList)
      .catch((error) => {
        if (error.name !== "AbortError") applyListError(error);
      });
    return () => controller.abort();
  }, [applyList, applyListError]);

  const reload = async () => {
    setIsRefreshing(true);
    try {
      applyList(await studentApi.list());
    } catch (error) {
      applyListError(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSubmit = async (values) => {
    if (editingStudent) {
      const { data, message } = await studentApi.update(editingStudent._id, values);
      setStudents((current) => current.map((s) => (s._id === data._id ? data : s)));
      setEditingStudent(null);
      notify.success(message);
    } else {
      const { data, message } = await studentApi.create(values);
      setStudents((current) => [data, ...current]);
      notify.success(message);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const { message } = await studentApi.remove(deleteTarget._id);
      setStudents((current) => current.filter((s) => s._id !== deleteTarget._id));
      if (editingStudent?._id === deleteTarget._id) setEditingStudent(null);
      notify.success(message);
      setDeleteTarget(null);
    } catch (error) {
      notify.error(error.message);
      if (error.status === 404) {
        setDeleteTarget(null);
        reload();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const retryButton = (
    <button
      type="button"
      onClick={reload}
      disabled={isRefreshing}
      className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-300 transition hover:bg-slate-50 disabled:opacity-60"
    >
      {isRefreshing ? <Spinner /> : null}
      Try again
    </button>
  );

  let listContent;
  if (status === "loading") {
    listContent = <ListSkeleton />;
  } else if (status === "error") {
    listContent = (
      <ListMessage tone="error" title="Couldn't load students" description={loadError} action={retryButton} />
    );
  } else if (students.length === 0) {
    listContent = (
      <ListMessage
        title="No students yet"
        description="Use the registration form to add your first student record."
      />
    );
  } else {
    const visibleStudents = applyFilters(students, filters);
    const isFiltered = filters.query.trim() !== "" || filters.department !== "";
    listContent = (
      <>
        <StudentToolbar filters={filters} onChange={setFilters} departments={departments} />
        {isFiltered ? (
          <p className="mb-3 text-xs text-slate-500" aria-live="polite">
            Showing {visibleStudents.length} of {students.length} students
          </p>
        ) : null}
        {visibleStudents.length === 0 ? (
          <ListMessage
            title="No matching students"
            description="Try a different search term or department."
            action={
              <button
                type="button"
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-300 transition hover:bg-slate-50"
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <StudentTable
            students={visibleStudents}
            editingId={editingStudent?._id}
            onEdit={handleEdit}
            onDelete={setDeleteTarget}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Header studentCount={students.length} isLoading={status === "loading"} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Student management</h1>
          <p className="mt-1 text-sm text-slate-500">Register, update and remove student records.</p>
        </div>

        {status === "ready" && students.length > 0 ? <StudentStats students={students} /> : null}

        <div className="grid items-start gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="xl:sticky xl:top-20">
            <StudentForm
              key={editingStudent?._id ?? "new"}
              student={editingStudent}
              onSubmit={handleSubmit}
              onCancel={() => setEditingStudent(null)}
            />
          </div>

          <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">Student records</h2>
              {status === "ready" ? (
                <button
                  type="button"
                  onClick={reload}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-60"
                >
                  {isRefreshing ? <Spinner className="h-3.5 w-3.5" /> : null}
                  Refresh
                </button>
              ) : null}
            </div>
            {listContent}
          </section>
        </div>
      </main>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete student?"
        message={
          deleteTarget
            ? `This will permanently remove ${deleteTarget.name} (${deleteTarget.email}). This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        isProcessing={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
