import CaseHistory from "../../models/caseHistory.js";
import User from "../../models/user.js";

export const getMyCaseHistory = async (req, res) => {
  try {
    const patientId = req.user._id;

    // Fetch all case histories for this patient
    const histories = await CaseHistory.find({ patient: patientId })
      .populate(
        "doctor",
        "_id specialization experience degrees bio profilePic"
      )
      .populate("appointment", "date timeSlot status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      total: histories.length,
      histories,
    });
  } catch (error) {
    console.error("Error fetching case history:", error);
    res.status(500).json({
      message: "Failed to load case history",
      error: error.message,
    });
  }
};
