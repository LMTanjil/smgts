import mongoose from "mongoose";
import { DatabaseConfigError } from "./dbConnect";

/**
 * Consistent JSON response helpers for the API routes.
 * Every response has the shape: { success, message?, data?, errors? }
 */

export function ok(data, { message, status = 200 } = {}) {
  return Response.json({ success: true, ...(message && { message }), data }, { status });
}

export function fail(message, status = 400, errors) {
  return Response.json({ success: false, message, ...(errors && { errors }) }, { status });
}

export function isValidObjectId(id) {
  return mongoose.isValidObjectId(id) && String(new mongoose.Types.ObjectId(id)) === id;
}

/** Parse a JSON request body; returns null when the body is not valid JSON. */
export async function readJson(request) {
  try {
    const body = await request.json();
    return body && typeof body === "object" && !Array.isArray(body) ? body : null;
  } catch {
    return null;
  }
}

const CONNECTION_ERROR_NAMES = new Set([
  "MongooseServerSelectionError",
  "MongoServerSelectionError",
  "MongoNetworkError",
  "MongoNetworkTimeoutError",
  "MongoTopologyClosedError",
  "MongoNotConnectedError",
]);

/**
 * Translate any thrown error into a user-friendly API response.
 * Technical details are logged on the server only, never sent to the client.
 */
export function handleApiError(error, fallbackMessage) {
  if (error?.code === 11000) {
    return fail("A student with this email already exists.", 409, {
      email: "This email is already registered.",
    });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const errors = Object.fromEntries(
      Object.entries(error.errors).map(([field, err]) => [field, err.message])
    );
    return fail("Please correct the highlighted fields.", 400, errors);
  }

  if (error instanceof mongoose.Error.CastError) {
    return fail("Invalid student ID.", 400);
  }

  console.error("[api]", error);

  if (error instanceof DatabaseConfigError) {
    return fail("The database is not configured. Please contact the administrator.", 500);
  }

  if (CONNECTION_ERROR_NAMES.has(error?.name)) {
    return fail("Unable to connect to the database. Please try again shortly.", 503);
  }

  return fail(fallbackMessage, 500);
}
