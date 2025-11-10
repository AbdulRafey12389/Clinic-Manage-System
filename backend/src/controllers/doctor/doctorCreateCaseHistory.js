import CaseHistory from "../../models/caseHistory.js";
import Appointment from "../../models/appointment.js";

export const createCaseHistory = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const { appointmentId, doctorName, diagnosis, prescription, followUp, aiSummary } =
      req.body;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: doctorId,
      status: "Completed",
    }).populate("patient", "name email");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message:
          "Appointment not found or not completed yet. Complete the appointment first.",
      });
    }

    const existingCase = await CaseHistory.findOne({
      patient: appointment.patient._id,
    });

    if (existingCase) {
      return res.status(400).json({
        success: false,
        message: `Case history for patient "${appointment.patient.name}" already exists.`,
      });
    }
    const caseHistory = new CaseHistory({
      patient: appointment.patient._id,
      doctor: doctorId,
      doctorName,
      appointment: appointmentId,
      diagnosis,
      prescription,
      followUp,
      aiSummary,
    });

    await caseHistory.save();

    res.status(201).json({
      success: true,
      message: "Case history created successfully",
      caseHistory,
    });
  } catch (error) {
    console.error("Error creating case history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create case history",
      error: error.message,
    });
  }
};
