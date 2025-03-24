import express from "express";
const router = express.Router();
import { validator } from "../../helper/common/validator.js";
import authMiddleware from "../../helper/common/jwtMiddelware.js";
import { loginAuth } from "../../helper/common/staticAuth.js";
import {
    userLogin,
    getPatientDoctorsList,
    userRegister,
    getUserDetail,
    getUserList,
} from "./controller.js";

router.post("/userLogin", loginAuth, userLogin);
router.post("/getPatientDoctorsList", authMiddleware, getPatientDoctorsList);
router.get("/getUserDetail", authMiddleware, getUserDetail);
router.post("/userRegister", loginAuth, validator("registerValidation"), userRegister);
router.post("/getUserList", getUserList);

export default router;