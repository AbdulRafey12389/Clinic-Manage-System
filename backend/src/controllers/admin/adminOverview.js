import Doctor from "../../models/doctor.js";
import User from "../../models/user.js";
import Room from "../../models/room.js";
import Appointment from "../../models/appointment.js";

const getAdminOverview = async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalRooms = await Room.countDocuments();
    const totalAppointments = await Appointment.countDocuments();

    const recentDoctors = await Doctor.find()
      .populate("_id", "name email")
      .sort({ createdAt: -1 })
      .limit(4);

    const appointmentStats = await Appointment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const chartData = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };

    appointmentStats.forEach((stat) => {
      chartData[stat._id] = stat.count;
    });

    res.status(200).json({
      success: true,
      overview: {
        totalDoctors,
        totalPatients,
        totalRooms,
        totalAppointments,
      },
      recentDoctors,
      chartData,
    });
  } catch (error) {
    console.error("Admin Overview Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin overview",
    });
  }
};

export default getAdminOverview;
