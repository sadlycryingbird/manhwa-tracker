import express from "express";
import "../db.js"; // connect to DB
import manhwaRoutes from "./routes/manhwas.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/manhwas", manhwaRoutes);

if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => console.log("Server running on port 3000"));
}

export default app;