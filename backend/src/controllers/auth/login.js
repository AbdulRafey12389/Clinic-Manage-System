// CUSTOM MODULES...
import User from "../../models/user.js";
import { generateToken } from "../../utils/jwt.js";

const login = async (req, res) => {
  const { email, password, role } = req.body;
  const ADMIN_EMAILS = process.env.ADMIN_EMAIL.split(",");

  try {
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Please provide email, password, and role" });
    }

    if (role === "admin" && !ADMIN_EMAILS.includes(email)) {
      return res.status(403).json({ message: "Access denied - Unauthorize" });
    }

    const user = await User.findOne({ email, role }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ userId: user._id, role: user.role });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export default login;
