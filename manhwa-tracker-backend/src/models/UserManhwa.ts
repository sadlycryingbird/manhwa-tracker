import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IUserManhwa extends Document {
    userId : Types.OjbectId;
    manhwaId : string;
    status : "unread" | "reading" | "completed" | "plan_to_read";
    currentChapter : number;
}

const userManhwaSchema : Schema<IUserManhwa> = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        manhwaId: { type: String, required: true },
        status: { type: String, enum: ["unread", "reading", "completed", "plan_to_read"], required: true },
        currentChapter: { type: Number, required: true, min: 1 },
    },
    { timestamps : true }
);

userManhwaSchema.index({ userId: 1, manhwaId: 1 }, { unique: true })

const UserManhwa : Model<IUserManhwa> = mongoose.model<IUserManhwa>("UserManhwa", userManhwaSchema);
export default UserManhwa;