// src/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  const MONGO_URI =
    process.env.NODE_ENV === "test"
      ? process.env.MONGO_TEST_URI
      : `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.ufzo2fl.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;