import mongoose from "mongoose";

const userManhwaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    manhwaId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["unread", "reading", "completed", "plan_to_read"],
      required: true,
    },
    currentChapter: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

// Prevent duplicates: same user + same manhwa
userManhwaSchema.index(
    { userId: 1, manhwaId: 1 }, 
    { unique: true });

const UserManhwa = mongoose.model("UserManhwa", userManhwaSchema);
export default UserManhwa;