import express from "express";
import Manhwa from "../models/Manhwa.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {

        const manhwas = await Manhwa.find();
        res.status(200).json({
        success: true,
        count: manhwas.length,
        data: manhwas
    });       

}));

router.post("/", asyncHandler(async (req, res) => {

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

}));

router.delete("/:id", asyncHandler(async (req, res) => {


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

}));

router.patch("/:id", asyncHandler(async (req, res) => {

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

}));

export default router;