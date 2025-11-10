import CaseHistory from "../../models/caseHistory.js";

export const getDoctorCaseHistories = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const cases = await CaseHistory.find({ doctor: doctorId })
      .populate("patient", "name age gender email")
      .populate("appointment", "date timeSlot status")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, total: cases.length, cases });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch doctor case histories",
      error: error.message,
    });
  }
};
