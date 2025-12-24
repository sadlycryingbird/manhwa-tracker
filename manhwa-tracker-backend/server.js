import express from "express";

const app = express();
const PORT = 3000;
const manhwas = [];

app.use(express.json());

app.get("/manhwas", (req, res) => {

    res.status(200).json({
        success: true,
        count: manhwas.length,
        data: manhwas
    });
});

app.post("/manhwas", (req, res) => {

    const {title, rating, status} = req.body;

    if (!title || !status) {
        return res.status(400).json({
            success: false,
            message: "Title and status are required"
        });
    }

    const newManhwa = {title, rating, status};
    manhwas.push({title, rating, status});

    res.status(201).json({
        success: true, 
        newManhwa, 
        message: "Manhwa added"
    });

});

app.delete("/manhwas/:id", (req, res) => {
    const id = parseInt(req.params.id);

    if (!manhwas[id]) {
        return res.status(404).json({
            success: false, 
            message: "Manhwa not found"
        });
    }
    manhwas.splice(id, 1);
    res.json({
        success: true, 
        manhwas, 
        message: "Manhwa deleted"
    });
});

app.patch("/manhwas/:id", (req, res) => {

    const id = parseInt(req.params.id);
    const status = req.body.status;

    if (!status) {
        return res.status(400).json({
            success: false,
            message: "status is required as input"
        });
    }

    if (!manhwas[id]) {
        return res.status(404).json({
            success: false, 
            message: "Manhwa not found"
        });
    }

    manhwas[id].status = status;
    res.json({ 
        success: true, 
        manhwas, 
        message: "Manhwa updated"});

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});