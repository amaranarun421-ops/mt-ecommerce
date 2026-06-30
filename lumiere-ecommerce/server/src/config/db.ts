import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { config } from "./index.js";

let memoryServer: MongoMemoryServer | null = null;

export async function connectDB(): Promise<void> {
  let uri = config.mongoUri;

  // If no MONGODB_URI is provided, spin up an in-memory MongoDB for dev.
  if (!uri) {
    console.log("[db] No MONGODB_URI set — starting in-memory MongoDB for development...");
    memoryServer = await MongoMemoryServer.create({
      instance: { port: 0, dbName: "lumiere" },
      binary: { version: "8.0.4" },
    });
    uri = memoryServer.getUri();
    console.log(`[db] In-memory MongoDB started at ${uri}`);
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log(`[db] Connected to MongoDB (${config.nodeEnv})`);

  mongoose.connection.on("error", (err) => {
    console.error("[db] MongoDB connection error:", err);
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("[db] MongoDB disconnected");
  });
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
