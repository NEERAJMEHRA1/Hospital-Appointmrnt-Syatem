//NPM
import mongoose from "mongoose";
import { validationResult } from "express-validator";
//Models
import appointmentModel from "../../models/appointment.js";
//Functions
import logger from '../../../logger.js';
import { getMessage } from "../../helper/common/helpers.js";
import { userType } from "../../helper/common/constant.js";
import { checkAppointment, getAppointmentById } from "./service.js";

/**
 * @Method Method used to booked appointment
 * @author Neeraj-Mehra
 * @param {*} req 
 * @param {*} res 
 * @date 24-March-2025
 */
export const bookAppointment = async (req, res) => {
    try {
        const { language, doctorId, appointmentDate, appointmentTime, notes } = req.body;

        //check user type
        const userRole = req.user.role;
        if (userRole != userType.patient) {
            return res.status(400).send({
                status: false,
                message: "Invalied user"
            })
        }
        //validation check
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send({
                status: false,
                message: await getMessage(language, errors.errors[0]["msg"]),
            })
        };

        const date = new Date(appointmentDate);

        // Check for existing appointment conflict
        const checkSlot = await checkAppointment(doctorId, appointmentDate, appointmentTime,)

        if (checkSlot && checkSlot.status) {
            // Create new appointment
            const appointmentObj = new appointmentModel({
                patient: req.user.id,
                doctor: doctorId,
                appointmentDate: date,
                appointmentTime,
                notes
            });

            const saveData = await appointmentObj.save();

            if (saveData) {
                logger.info(`#####*****bookAppointment : user register success*****#####`);

                return res.status(200).send({
                    status: true,
                    message: "Appointment booked successfully.",
                })
            }

            logger.info(`#####*****bookAppointment : Feild to user register*****#####`);

            return res.send({
                status: false,
                message: "Feild to booked appointment."
            });
        } else {
            return res.status(409).send({
                status: false,
                message: "Appointment not available at the selected time."
            });
        }
    } catch (err) {
        logger.error("bookAppointment : Error===>>> " + err.message);
        res.status(500).send({
            status: false,
            message: err.message
        });
    }
};

/**
 * @Method Method used to cancel appointment
 * @author Neeraj-Mehra
 * @param {*} req 
 * @param {*} res 
 * @date 24-March-2025
 */
export const cancelAppointment = async (req, res) => {
    try {
        const id = req.query.id;
        const language = req.query.language;

        //decoded user role and id
        const userId = req.user.id;
        const userRole = req.user.role;

        if (userRole != userType.patient) {
            return res.status(400).send({
                status: false,
                message: "Invalied user"
            })
        }

        const appointment = await getAppointmentById(id, userId);

        if (!appointment) {
            return res.status(404).send({
                status: false,
                message: "Appointment not found"
            });
        }
        // appointment.status = "cancelled";
        // await appointment.save();


        //update data in DB
        const updateData = await appointmentModel.updateOne(
            { _id: new mongoose.Types.ObjectId(id) },
            {
                $set: {
                    status: 2
                }
            },
        );
        logger.info("#####*****cancelAppointment : success*****#####")

        res.status(200).send({
            status: true,
            message: "Appointment cancelled"
        });

    } catch (err) {
        logger.error("cancelAppointment : Error===>>> " + err.message);
        res.status(500).send({
            status: true,
            message: err.message
        });
    }
};


/**
 * @Method Method used to get all appointment
 * @author Neeraj-Mehra
 * @param {*} req 
 * @param {*} res 
 * @date 24-March-2025
 */
export const getAppointments = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({ patient: req.user.id })
            .populate("doctor", "userName email");
        res.status(200).send({
            status: true,
            message: "List fetched success",
            data: appointments,
        })
    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        });
    }
};



/**
 * @Method Method used to get docter wise appointment
 * @author Neeraj-Mehra
 * @param {*} req 
 * @param {*} res 
 * @date 24-March-2025
 */
export const getDocterAppointments = async (req, res) => {
    try {

        //get user id
        const userId = req.user.id;

        const appointments = await appointmentModel.find({ docter: userId })
            .populate("patient", "userName email");
        res.status(200).send({
            status: true,
            message: "List fetched success",
            data: appointments,
        })
    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        });
    }
};