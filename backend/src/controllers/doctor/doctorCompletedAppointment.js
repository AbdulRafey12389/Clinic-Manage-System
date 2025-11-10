
import Appointment from "../../models/appointment.js";

export const getCompletedAppointments = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const appointments = await Appointment.find({
      doctor: doctorId,
      status: "Completed",
    })
      .populate("patient", "name email age gender phone address") 
      .populate("room", "roomNumber type status")
      .sort({ date: -1, timeSlot: 1 }); 

    res.status(200).json({
      success: true,
      total: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching completed appointments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch completed appointments",
      error: error.message,
    });
  }
};
