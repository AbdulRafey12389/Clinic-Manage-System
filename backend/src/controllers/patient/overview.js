import Appointment from "../../models/appointment.js";
import CaseHistory from "../../models/caseHistory.js";
import mongoose from "mongoose";

export const getPatientOverview = async (req, res) => {
  try {
    const patientId = req.user._id;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const dailyData = await Appointment.aggregate([
      {
        $match: {
          patient: new mongoose.Types.ObjectId(patientId),
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: { day: { $dayOfMonth: "$createdAt" } },
          totalAppointments: { $sum: 1 },
        },
      },
      { $sort: { "_id.day": 1 } },
    ]);

    const totalDays = endOfMonth.getDate();
    const chartData = Array.from({ length: totalDays }, (_, i) => {
      const found = dailyData.find((d) => d._id.day === i + 1);
      return { day: i + 1, total: found ? found.totalAppointments : 0 };
    });

    const pendingAppointments = await Appointment.find({
      patient: patientId,
      status: "Pending",
    })
      .populate("doctor", "fullName email specialization")
      .populate("room", "name roomNumber")
      .populate("patient", "name email")
      .sort({ date: 1 });

    const completedAppointments = await Appointment.find({
      patient: patientId,
      status: "Completed",
    })
      .populate("doctor", "fullName email specialization")
      .populate("room", "name roomNumber")
      .sort({ updatedAt: -1 });

    const recentCaseHistory = await CaseHistory.find({ patient: patientId })
      .populate("doctor", "fullName email specialization")
      .populate("appointment", "date timeSlot status")
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      message: "Patient overview fetched successfully",
      data: {
        chartData,
        pendingAppointments,
        completedAppointments,
        recentCaseHistory,
      },
    });
  } catch (error) {
    console.error("Patient Overview Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
