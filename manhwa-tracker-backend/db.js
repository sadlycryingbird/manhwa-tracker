import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const { MONGO_USER, MONGO_PASS, MONGO_CLUSTER, MONGO_DB } = process.env;

mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_CLUSTER}.ufzo2fl.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));