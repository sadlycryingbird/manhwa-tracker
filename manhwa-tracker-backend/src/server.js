// src/server.js
import dotenv from "dotenv";
dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

import app from "./app.js";
import connectDB from "./db.js";

const PORT = process.env.PORT || 3000;

await connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});