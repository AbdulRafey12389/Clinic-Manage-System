// CUSTOM MODULES...
import User from "../../models/user.js";
import { generateToken } from "../../utils/jwt.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All field are required" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    return res.status(201).json({
      message: "User registered successfully. ",
      user: {
        id: user._id,
        fullName: user.fullName,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken({ userId: user._id, role: user.role }),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export default register;
