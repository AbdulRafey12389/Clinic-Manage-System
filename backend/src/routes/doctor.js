import { Router } from "express";

const router = Router();

import { getDoctorAppointments } from "../controllers/doctor/doctorAppoinment.js";
import { getCompletedAppointments } from "../controllers/doctor/doctorCompletedAppointment.js";
import generateAiSummary from "../controllers/doctor/generateAISummary.js";
import { createCaseHistory } from "../controllers/doctor/doctorCreateCaseHistory.js";
import { getDoctorCaseHistories } from "../controllers/doctor/doctorGetCaseHistory.js";
import { getDoctorOverview } from "../controllers/doctor/doctorOverview.js";
import { updateAppointmentStatus } from "../controllers/doctor/doctorUpdateAppoitmentSatus.js";

import authentication from "../middlewares/authentication.js";
import authorization from "../middlewares/authorization.js";

router.get(
  "/dashboard",
  authentication,
  authorization("doctor"),
  getDoctorOverview
);

router.get(
  "/doctor-appointment",
  authentication,
  authorization("doctor"),
  getDoctorAppointments
);

router.get(
  "/doctor-completed-appointment",
  authentication,
  authorization("doctor"),
  getCompletedAppointments
);

router.post(
  "/ai-summary",
  authentication,
  authorization("doctor"),
  generateAiSummary
);

router.post(
  "/create-case-history",
  authentication,
  authorization("doctor"),
  createCaseHistory
);

router.get(
  "/get-case-history",
  authentication,
  authorization("doctor"),
  getDoctorCaseHistories
);

router.post(
  "/update-appointment/:appointmentId",
  authentication,
  authorization("doctor"),
  updateAppointmentStatus
);

export default router;
