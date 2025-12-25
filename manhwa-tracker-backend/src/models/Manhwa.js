import mongoose from "mongoose";

const manhwaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    rating: { type: String },
    status: { type: String, required: true }
});

const Manhwa = mongoose.model("Manhwa", manhwaSchema);

export default Manhwa;