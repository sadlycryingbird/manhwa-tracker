import express from "express";
import { logger, errorHandler } from "./middleware/index.js";
import userManhwaRoutes from "./routes/userManhwa.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
app.use(express.json());

app.use(logger);

app.use("/auth", authRoutes);
app.use("/user-manhwa", userManhwaRoutes);

app.use(errorHandler);

export default app;