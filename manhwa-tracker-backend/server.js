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
    res.json({ success: true, manhwas, message: "Manhwa added"});

});

app.delete("/manhwas/:id", (req, res) => {
    const id = parseInt(req.params.id);

    if (!manhwas[id]) {
        return res.status(404).json({success: false, message: "Manhwa not found"});
    }
    manhwas.splice(id, 1);
    res.json({success: true, manhwas, message: "Manhwa deleted"});
});

app.patch("/manhwas/:id", (req, res) => {

    const id = parseInt(req.params.id);
    const status = req.body.status;

    if (!manhwas[id]) {
        return res.status(404).json({ success: false, message: "Manhwa not found" });
    }

    manhwas[id].status = status;
    res.json({ success: true, manhwas, message: "Manhwa updated"});

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});