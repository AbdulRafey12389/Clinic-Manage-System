import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const dbOptions = {
  dbName: "Clinic_Management_System",
  appName: "ClinicManagementSystem",
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
};

export const connectToDatabase = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(MONGODB_URI, dbOptions);

    console.log("MongoDb connected successfuly");
  } catch (err) {
    console.error(" MongoDB connection failed", err);
    throw err;
  }
};

export const disconnectFromDatabase = async () => {
  try {
    await mongoose.disconnect();

    console.log("Disconnecting database successfully.");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    console.error("Error to Disconnecting mongoDb database.", error);
  }
};
