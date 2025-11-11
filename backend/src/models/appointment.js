import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const appointmentSchema = new Schema({
  patient: { type: Types.ObjectId, ref: "User", required: true },
  doctor: { type: Types.ObjectId, ref: "Doctor", required: true },
  doctorName: { type: String, required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  room: { type: Types.ObjectId, ref: "Room" },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Completed", "Cancelled"],
    default: "Pending",
  },
  reason: { type: String },
  createdAt: { type: Date, default: Date.now },
});

appointmentSchema.index({ doctor: 1, date: 1, timeSlot: 1 });
appointmentSchema.index({ patient: 1, date: 1 });

export default model("Appointment", appointmentSchema);
