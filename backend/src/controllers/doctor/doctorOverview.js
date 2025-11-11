import mongoose from "mongoose";
import Appointment from "../../models/appointment.js";
import CaseHistory from "../../models/caseHistory.js";

export const getDoctorOverview = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const today = new Date().toISOString().split("T")[0];

    const todayAppointments = await Appointment.find({
      doctor: doctorId,
      date: today,
    })
      .populate("patient", "name age gender")
      .populate("room", "roomNumber type status")
      .sort({ timeSlot: 1 });

    const totalAppointments = await Appointment.countDocuments({
      doctor: doctorId,
    });

    const totalPatientsAgg = await Appointment.aggregate([
      { $match: { doctor: new mongoose.Types.ObjectId(doctorId) } },
      { $group: { _id: "$patient" } },
      { $count: "uniquePatients" },
    ]);

    const totalPatients =
      totalPatientsAgg.length > 0 ? totalPatientsAgg[0].uniquePatients : 0;

    const totalCaseReviewed = await CaseHistory.countDocuments({
      doctor: doctorId,
    });

    const appointmentStats = await Appointment.aggregate([
      { $match: { doctor: new mongoose.Types.ObjectId(doctorId) } },
      {
        $group: {
          _id: { $substr: ["$date", 0, 7] },
          totalAppointments: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const chartData = appointmentStats.map((item) => ({
      month: item._id,
      totalAppointments: item.totalAppointments,
    }));

    res.status(200).json({
      success: true,
      message: "Doctor overview fetched successfully",
      data: {
        todayAppointments,
        stats: {
          totalAppointments,
          todayAppointmentsCount: todayAppointments.length,
          totalPatients,
          totalCaseReviewed,
        },
        chartData,
      },
    });
  } catch (error) {
    console.error("Error fetching doctor overview:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctor overview",
      error: error.message,
    });
  }
};
