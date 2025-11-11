import User from "../../models/user.js";

export const getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" })
      .select("name email phone age gender imageUrl createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: patients.length,
      patients,
    });
  } catch (error) {
    console.error("Admin Get All Patients Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch patients",
    });
  }
};
