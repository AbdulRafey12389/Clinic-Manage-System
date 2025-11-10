// controllers/appointment.controller.js
import Appointment from "../../models/appointment.js";
// import Doctor from "../../models/doctor.js";
// import Room from "../";

const getMyAppointments = async (req, res) => {
  try {
    const patientId = req.user._id;

    const appointments = await Appointment.find({ patient: patientId })
      .populate({
        path: "doctor",
        select: " name specialization experience degrees bio profilePic",
      })
      .populate({
        path: "room",
        select: "roomNumber type capacity status",
      })
      .sort({ date: -1, createdAt: -1 });


    // Calculate today's date (only YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];

    // Filter categories and map isToday
    const waiting = appointments
      .filter((a) => a.status === "Pending")
      .map((a) => ({
        ...a._doc,
        isToday: a.date === today,
      }));

    const completed = appointments
      .filter((a) => a.status === "Completed")
      .map((a) => ({
        ...a._doc,
        isToday: a.date === today,
      }));

    const cancelled = appointments
      .filter((a) => a.status === "Cancelled")
      .map((a) => ({
        ...a._doc,
        isToday: a.date === today,
      }));

    return res.status(200).json({
      total: appointments.length,
      waiting,
      completed,
      cancelled,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default getMyAppointments;
