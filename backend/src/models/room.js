import mongoose from "mongoose";
const { Schema, model } = mongoose;

const roomSchema = new Schema({
  roomNumber: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ["ICU", "Private", "General", "OPD"],
    default: "OPD",
  },
  capacity: { type: Number, default: 1 },
  status: {
    type: String,
    enum: ["Available", "Occupied", "Maintenance"],
    default: "Available",
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default model("Room", roomSchema);
