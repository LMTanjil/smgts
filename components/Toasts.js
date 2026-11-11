"use client";

import { useCallback, useState } from "react";

const TOAST_DURATION_MS = 4000;
let nextToastId = 0;

/** Small toast-notification store: `notify.success(msg)` / `notify.error(msg)`. */
export function useToasts() {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (type, message) => {
      const id = ++nextToastId;
      setToasts((current) => [...current.slice(-3), { id, type, message }]);
      setTimeout(() => dismiss(id), TOAST_DURATION_MS);
    },
    [dismiss]
  );

  const notify = {
    success: (message) => push("success", message),
    error: (message) => push("error", message),
  };

  return { toasts, notify, dismiss };
}

const STYLES = {
  success: { box: "bg-white ring-emerald-200", dot: "bg-emerald-500", label: "Success" },
  error: { box: "bg-white ring-red-200", dot: "bg-red-500", label: "Error" },
};

export function ToastStack({ toasts, onDismiss }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 top-20 z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end"
    >
      {toasts.map((toast) => {
        const style = STYLES[toast.type];
        return (
          <div
            key={toast.id}
            role={toast.type === "error" ? "alert" : "status"}
            className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg px-4 py-3 shadow-lg ring-1 ${style.box}`}
          >
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${style.dot}`} aria-hidden="true" />
            <p className="flex-1 text-sm text-slate-800">
              <span className="sr-only">{style.label}: </span>
              {toast.message}
            </p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="-mr-1 rounded px-1 text-lg leading-none text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
