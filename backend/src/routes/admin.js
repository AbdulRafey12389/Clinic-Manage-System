// NODE MODULES...
import { Router } from "express";

// ADMIN CONTORLLER...
import getAdminOverview from "../controllers/admin/adminOverview.js";
import {
  addDoctor,
  editDoctor,
  deleteDoctor,
  getAllDoctors,
} from "../controllers/admin/adminDoctor.js";
import {
  createRoom,
  deleteRoom,
  getAllRooms,
  updateRoom,
} from "../controllers/admin/adminRoom.js";

// MIDDLEWARES...
import authentication from "../middlewares/authentication.js";
import authorization from "../middlewares/authorization.js";

const router = Router();

router.get(
  "/dashboard",
  authentication,
  authorization("admin"),
  getAdminOverview
);

router.post(
  "/create-doctor",
  authentication,
  authorization("admin"),
  addDoctor
);

router.get(
  "/get-doctor",
  authentication,
  authorization("admin"),
  getAllDoctors
);

router.put(
  "/edit-doctor/:id",
  authentication,
  authorization("admin"),
  editDoctor
);

router.delete(
  "/delete-doctor/:id",
  authentication,
  authorization("admin"),
  deleteDoctor
);

router.post("/create-room", authentication, authorization("admin"), createRoom);
router.get("/get-room", authentication, authorization("admin"), getAllRooms);

router.delete(
  "/delete-room/:id",
  authentication,
  authorization("admin"),
  deleteRoom
);
router.put(
  "/edit-room/:id",
  authentication,
  authorization("admin"),
  updateRoom
);

export default router;
