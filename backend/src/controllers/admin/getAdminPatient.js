import User from "../models/User.js";
import Appointment from "../models/Appointment.js";

// ====================== ADMIN GET ALL PATIENTS WITH APPOINTMENTS ======================
export const getAllPatientsWithAppointments = async (req, res) => {
  try {
    const { name, status } = req.query;

    // Step 1: Filter patients
    const userFilter = { role: "patient" };
    if (name) {
      userFilter.name = { $regex: name, $options: "i" };
    }

    // Step 2: Fetch all patients
    const patients = await User.find(userFilter)
      .select("name email age gender phone avatar createdAt")
      .lean();

    // Step 3: Fetch appointments for each patient
    const results = await Promise.all(
      patients.map(async (p) => {
        // Optional filter by appointment status
        const appointmentFilter = { patient: p._id };
        if (status) appointmentFilter.status = status;

        const appointments = await Appointment.find(appointmentFilter)
          .populate("doctor", "specialization _id")
          .populate("room", "roomNumber type")
          .select("date day timeSlot status reason createdAt")
          .lean();

        return {
          ...p,
          totalAppointments: appointments.length,
          pendingAppointments: appointments.filter(
            (a) => a.status === "Pending"
          ).length,
          completedAppointments: appointments.filter(
            (a) => a.status === "Completed"
          ).length,
          cancelledAppointments: appointments.filter(
            (a) => a.status === "Cancelled"
          ).length,
          appointments,
        };
      })
    );

    res.status(200).json({
      success: true,
      total: results.length,
      patients: results,
    });
  } catch (error) {
    console.error("Admin Get Patients Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch patients data",
    });
  }
};
