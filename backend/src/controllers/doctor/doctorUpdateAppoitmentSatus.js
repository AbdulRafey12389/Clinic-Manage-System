import Appointment from "../../models/appointment.js";
import mongoose from "mongoose";

export const updateAppointmentStatus = async (req, res) => {
  try {
    const doctorId = req.user._id; // logged-in doctor
    const { appointmentId } = req.params;
    console.log(appointmentId);
    const { status } = req.body;

    const allowedStatuses = ["Pending", "Completed", "Cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(
          ", "
        )}`,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID",
      });
    }

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: doctorId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or you do not have permission",
      });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}`,
      appointment,
    });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update appointment status",
      error: error.message,
    });
  }
};
