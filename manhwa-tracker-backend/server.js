import express from "express";

const app = express();
const PORT = 3000;
const manhwas = [];

app.use(express.json());

app.get("/", (req, res) => {
    res.json(
        {
            manhwa: "solo leveling",
            rating: "9.5"
        }
    );
});

app.post("/manhwas", (req, res) => {
    const {title, rating, status} = req.body;
    manhwas.push({title, rating, status});
    res.json({ success: true, manhwas });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});