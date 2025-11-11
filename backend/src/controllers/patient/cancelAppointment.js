import Appointment from "../../models/appointment.js";

export const cancelAppointment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    console.log(userId);

    if (appointment.patient.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this appointment",
      });
    }

    if (["Cancelled", "Completed"].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: `Appointment already ${appointment.status.toLowerCase()}`,
      });
    }

    appointment.status = "Cancelled";
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (err) {
    console.error("cancelAppointment Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
