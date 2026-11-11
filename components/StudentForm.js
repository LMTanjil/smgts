"use client";

import { useState } from "react";
import FormField from "./FormField";
import Spinner from "./Spinner";
import { validateStudent } from "@/lib/validation";

const EMPTY_STUDENT = { name: "", email: "", phone: "", department: "" };

const FIELDS = [
  { id: "name", label: "Full name", type: "text", placeholder: "e.g. Jane Doe", autoComplete: "name" },
  { id: "email", label: "Email address", type: "email", placeholder: "jane@example.com", autoComplete: "email" },
  { id: "phone", label: "Phone number", type: "tel", placeholder: "+1 555 123 4567", autoComplete: "tel" },
  { id: "department", label: "Department", type: "text", placeholder: "e.g. Computer Science" },
];

/**
 * Create/edit form. Remount it with a new `key` to switch between students.
 * `onSubmit(values)` should throw an ApiError on failure; its field errors
 * are shown inline next to the matching inputs.
 */
export default function StudentForm({ student, onSubmit, onCancel }) {
  const isEditing = Boolean(student);
  const [values, setValues] = useState(() =>
    student
      ? { name: student.name, email: student.email, phone: student.phone, department: student.department }
      : EMPTY_STUDENT
  );
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors(({ [name]: _removed, ...rest }) => rest);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const result = validateStudent(values);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(result.data);
      if (!isEditing) {
        setValues(EMPTY_STUDENT);
        setErrors({});
      }
    } catch (error) {
      if (error?.errors) setErrors(error.errors);
      setFormError(error?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {isEditing ? "Edit student" : "Register student"}
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {isEditing ? `Updating ${student.name}` : "All fields are required."}
          </p>
        </div>
        {isEditing ? (
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
            Editing
          </span>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          {FIELDS.map((field) => (
            <FormField
              key={field.id}
              {...field}
              value={values[field.id]}
              error={errors[field.id]}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          ))}
        </div>

        {formError ? (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
            {formError}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row">
          {isEditing ? (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:opacity-60 sm:flex-1"
            >
              Cancel
            </button>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 active:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-70 sm:flex-1"
          >
            {isSubmitting ? <Spinner /> : null}
            {isSubmitting ? "Saving…" : isEditing ? "Save changes" : "Add student"}
          </button>
        </div>
      </form>
    </section>
  );
}
