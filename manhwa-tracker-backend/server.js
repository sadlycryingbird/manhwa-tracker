import express from "express";
import "./db.js"; // connect to DB
import manhwaRoutes from "./routes/manhwas.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/manhwas", manhwaRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});