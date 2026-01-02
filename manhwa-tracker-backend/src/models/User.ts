import bcrypt from "bcryptjs"; // for password hashing
import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IUser extends Document {
  email: string;  
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema : Schema<IUser> = new Schema(
    {
        email: { type: String, required: true, trim: true, lowercase: true, unique: true, },
        password: { type: String, required: true, minlength: 6 }
    },
    { timestamps : true }
);


userSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) return;


  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User : Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;