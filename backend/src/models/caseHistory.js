import { Schema, model } from "mongoose";

const caseHistorySchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    doctorName: { type: String, required: true },
    appointment: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    diagnosis: { type: String, required: true },
    aiSummary: { type: String },
    prescription: { type: String },
    followUp: { type: String },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model("CaseHistory", caseHistorySchema);
