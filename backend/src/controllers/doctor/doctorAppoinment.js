import Appointment from "../../models/appointment.js";

export const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const { status } = req.query;

    console.log(status);

    const filter = { doctor: doctorId };
    if (status && status !== "All") {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter)
      .populate("patient", "name age gender")
      .populate("room", "roomNumber type status")
      .sort({ date: 1, timeSlot: 1 });

    res.status(200).json({
      success: true,
      total: appointments.length,
      data: appointments,
      message: `Appointment ${status} successfully`,
    });
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
};
