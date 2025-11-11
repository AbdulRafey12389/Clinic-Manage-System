import User from "../../models/user.js";
import Doctor from "../../models/doctor.js";

export const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      specialization,
      experience,
      degrees,
      bio,
      workingDays,
      day,
      from,
      to,
      slotDurationMinutes,
      fees,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !specialization ||
      !experience ||
      !degrees ||
      !bio ||
      !workingDays ||
      !day ||
      !from ||
      !to ||
      !fees
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });

    const newUser = await User.create({
      name,
      email,
      password,
      role: "doctor",
    });

    const newDoctor = await Doctor.create({
      _id: newUser._id,
      specialization,
      experience,
      degrees,
      bio,
      workingDays,
      schedule: { day, from, to, slotDurationMinutes },
      fees,
    });

    const populatedDoctor = await Doctor.findById(newDoctor._id).populate(
      "_id",
      "name email"
    );

    res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      doctor: populatedDoctor,
    });
  } catch (error) {
    console.error("Add Doctor Error:", error);
    res.status(500).json({ success: false, message: "Failed to add doctor" });
  }
};

export const editDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const userFields = ["name", "email"];
    const userUpdates = {};
    userFields.forEach((field) => {
      if (updates[field]) userUpdates[field] = updates[field];
    });

    const doctorFields = [
      "specialization",
      "experience",
      "degrees",
      "bio",
      "profilePic",
      "workingDays",
      "fees",
      "status",
    ];
    const doctorUpdates = {};
    doctorFields.forEach((field) => {
      if (updates[field]) doctorUpdates[field] = updates[field];
    });

    if (
      updates.day &&
      updates.from &&
      updates.to &&
      updates.slotDurationMinutes
    ) {
      doctorUpdates.schedule = [
        {
          day: updates.day,
          from: updates.from,
          to: updates.to,
          slotDurationMinutes: updates.slotDurationMinutes,
        },
      ];
    }

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(id, userUpdates);
    }

    const doctorExists = await Doctor.findByIdAndUpdate(id, doctorUpdates);
    if (!doctorExists) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    const populatedDoctor = await Doctor.findById(id).populate(
      "_id",
      "name email"
    );

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      doctor: populatedDoctor,
    });
  } catch (error) {
    console.error("Edit Doctor Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update doctor",
      error: error.message,
    });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByIdAndDelete(id);
    if (!doctor)
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });

    await User.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Delete Doctor Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete doctor" });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate("_id", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error("Get Doctors Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch doctors" });
  }
};
