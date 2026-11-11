/**
 * Client-side wrapper around the /api/students endpoints.
 * Converts network failures and error responses into ApiError instances
 * carrying a user-friendly message and optional field errors.
 */

export class ApiError extends Error {
  constructor(message, status = 0, errors = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

async function request(url, { method = "GET", body, signal } = {}) {
  let response;

  try {
    response = await fetch(url, {
      method,
      signal,
      cache: "no-store",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw new ApiError("Network error. Check your connection and try again.");
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    // Non-JSON response (e.g. a proxy error page); handled below.
  }

  if (!response.ok || !payload?.success) {
    throw new ApiError(
      payload?.message || "Something went wrong. Please try again.",
      response.status,
      payload?.errors || null
    );
  }

  return payload;
}

export const studentApi = {
  list: (signal) => request("/api/students", { signal }),
  create: (student) => request("/api/students", { method: "POST", body: student }),
  update: (id, student) => request(`/api/students/${id}`, { method: "PUT", body: student }),
  remove: (id) => request(`/api/students/${id}`, { method: "DELETE" }),
};
