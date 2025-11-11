import { Router } from "express";

import authRoutes from "./auth.js";
import adminRoutes from "./admin.js";
import patientRoutes from "./patient.js";
import doctorRoutes from './doctor.js'

const router = Router();

router.get("/", (req, res) => {
  res.send("api is working");
});

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/patient", patientRoutes);
router.use("/doctor", doctorRoutes);

export default router;
