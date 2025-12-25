import express from "express";
import Manhwa from "../models/Manhwa.js";

const router = express.Router();

router.get("/", async (req, res) => {

    try {
        const manhwas = await Manhwa.find();
        res.status(200).json({
        success: true,
        count: manhwas.length,
        data: manhwas
    });       
    } catch (err) {
        res.status(500).json({
            success: false, 
            error: err.message
        });
    }
});

router.post("/", async (req, res) => {

    try {
        const {title, rating, status} = req.body;

        if (!title || !status) {
            return res.status(400).json({
                success: false,
                message: "Title and status are required"
            });
    }

        const manhwa = await Manhwa.create({title, rating, status});

        res.status(201).json({
            success: true, 
            manhwa, 
            message: "Manhwa added"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        })
    }

});

router.delete("/:id", async (req, res) => {

    try {

        const manhwa = await Manhwa.findByIdAndDelete(req.params.id);

        if (!manhwa) {
            return res.status(404).json({
                success: false, 
                message: "Manhwa not found"
            });
        }

        res.json({
            success: true, 
            data: manhwa, 
            message: "Manhwa deleted"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        })
    }

});

router.patch("/:id", async (req, res) => {

    try {
        const status = req.body.status;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "status is required as input"
            });
        }

        const manhwa = await Manhwa.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!manhwa) {
            return res.status(404).json({
                success: false, 
                message: "Manhwa not found"
            });
        }
        
        res.json({ 
            success: true, 
            manhwa, 
            message: "Manhwa updated"});
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        })
    }

});

export default router;