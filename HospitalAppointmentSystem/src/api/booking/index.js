import express from "express";
const router = express.Router();
import { validator } from "../../helper/common/validator.js";
import authMiddleware from "../../helper/common/jwtMiddelware.js";
import {
    bookAppointment,
    cancelAppointment,
    getAppointments,
    getDocterAppointments
} from "./controller.js";

router.post("/bookAppointment", authMiddleware, validator("bookAppointment"), bookAppointment);
router.post("/cancelAppointment", authMiddleware, cancelAppointment);
router.get("/getAppointmentList", authMiddleware, getAppointments);
router.get("/getDocterAppointments", authMiddleware, getDocterAppointments);

export default router;