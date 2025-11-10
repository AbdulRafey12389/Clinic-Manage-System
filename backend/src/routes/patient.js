// NODE MODULES...
import { Router } from "express";

// CONTROLLER...
import { getAvailableDoctors } from "../controllers/patient/availableDoctor.js";
import { getAvailableRooms } from "../controllers/patient/getAvailableRoom.js";
import { bookAppoinment } from "../controllers/patient/bookAppoinment.js";
import getMyAppointments from "../controllers/patient/getMyAppointment.js";
import { getMyCaseHistory } from "../controllers/patient/getCaseHistory.js";
import { downloadCaseHistoryPdf } from "../controllers/patient/downloadPdf.js";
import { getPatientOverview } from "../controllers/patient/overview.js";

// MIDDLEWARES...
import authentication from "../middlewares/authentication.js";
import authorization from "../middlewares/authorization.js";
import { updateProfile } from "../controllers/patient/updateProfile.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.get(
  "/dashboard",
  authentication,
  authorization("patient"),
  getPatientOverview
);

router.get(
  "/available-doctor",
  authentication,
  authorization("patient"),
  getAvailableDoctors
);

router.get(
  "/available-room",
  authentication,
  authorization("patient"),
  getAvailableRooms
);
router.post(
  "/book-appointment",
  authentication,
  authorization("patient"),
  bookAppoinment
);

router.get(
  "/my-appointment",
  authentication,
  authorization("patient"),
  getMyAppointments
);

router.get(
  "/get-caseHistory",
  authentication,
  authorization("patient"),
  getMyCaseHistory
);

router.get(
  "/download-pdf/:historyId",
  authentication,
  authorization("patient"),
  downloadCaseHistoryPdf
);

router.post(
  "/update-profile",
  authentication,
  authorization("patient"),
  upload.single("image"),
  updateProfile
);

export default router;
