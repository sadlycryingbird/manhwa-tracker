// src/app.js
import express from "express";
import manhwaRoutes from "./routes/manhwas.js";
import { logger, errorHandler } from "./middleware/index.js";

const app = express();

// Body parsing
app.use(express.json());

// Logger to log all requests, both valid and invalid
app.use(logger);

// Routes (validation applied inside router)
app.use("/manhwas", manhwaRoutes);

// Error handler (always put this last)
app.use(errorHandler);

export default app;