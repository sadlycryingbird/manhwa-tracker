// src/app.js
import express from "express";
import manhwaRoutes from "./routes/manhwas.js";

const app = express();

app.use(express.json());
app.use("/manhwas", manhwaRoutes);

export default app;