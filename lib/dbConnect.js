import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, memoryServer: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      let mongoUri = process.env.MONGODB_URI;

      if (!mongoUri) {
        cached.memoryServer = await MongoMemoryServer.create();
        mongoUri = cached.memoryServer.getUri();
      }

      return mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
    })();
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

export default dbConnect;
