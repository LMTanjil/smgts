import mongoose from "mongoose";

/**
 * Shared Mongoose connection.
 *
 * In development, Next.js hot reloading re-evaluates modules, so the
 * connection is cached on `globalThis` to avoid opening a new connection
 * on every request or reload.
 */
let cached = globalThis.mongooseCache;

if (!cached) {
  cached = globalThis.mongooseCache = { conn: null, promise: null };
}

export class DatabaseConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = "DatabaseConfigError";
  }
}

export default async function dbConnect() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new DatabaseConfigError(
      "MONGODB_URI is not set. Add it to .env.local (see .env.example)."
    );
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
}
