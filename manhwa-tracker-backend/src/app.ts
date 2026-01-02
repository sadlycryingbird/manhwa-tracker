import express from "express";
import { logger, errorHandler } from "./middleware/index.ts";
import userManhwaRoutes from "./routes/userManhwa.routes.ts";
import authRoutes from "./routes/auth.routes.ts";

const app = express();
app.use(express.json());

app.use(logger);

app.use("/auth", authRoutes);
app.use("/user-manhwa", userManhwaRoutes);

app.use(errorHandler);

export default app;