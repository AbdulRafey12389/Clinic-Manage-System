import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, select: false, required: true },
  role: {
    type: String,
    enum: ["admin", "doctor", "patient"],
    default: "patient",
  },
  age: { type: Number, default: null },
  gender: { type: String, enum: ["male", "female"], default: null },
  phone: { type: String, default: null },
  imageUrl: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default model("User", userSchema);
