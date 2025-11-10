import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const scheduleSlotSchema = new Schema(
  {
    day: { type: String, required: true }, // e.g., "Monday"
    from: { type: String, required: true },
    to: { type: String, required: true },
    slotDurationMinutes: { type: Number, default: 30 },
  },
  { _id: false }
);

const doctorSchema = new Schema({
  _id: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  specialization: { type: String, required: true },
  experience: { type: String },
  degrees: { type: String },
  bio: { type: String },
  profilePic: { type: String, default: null },
  workingDays: [String],
  schedule: [scheduleSlotSchema],
  fees: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdAt: { type: Date, default: Date.now },
});

export default model("Doctor", doctorSchema);
