import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // for password hashing

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, 
      lowercase: true, 
      trim: true, // removes spaces
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

// Pre-save hook to hash password before saving
userSchema.pre("save", async function () {
  // `this` is the document
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;