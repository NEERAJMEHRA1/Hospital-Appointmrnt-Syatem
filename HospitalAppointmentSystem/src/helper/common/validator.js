import { body } from "express-validator";

export const validator = (method) => {
    switch (method) {
        case "registerValidation": {
            return [
                body("email", "Email_Id_Required").not().notEmpty(),
                body("password", "Password_Is_Required").not().notEmpty(),
                body("userName", "User_Name_Required").not().notEmpty(),
                body("phoneNumber", "Phone_Number_required").not().notEmpty(),
                body("role", "User_Role_Required").not().notEmpty(),

            ]
        }

        case "bookAppointment": {
            return [
                body("doctorId", "Docter_Id_Required").not().notEmpty(),
                body("appointmentDate", "Appointment_date_Required").not().notEmpty(),
                body("appointmentTime", "Appointment_Time_Required").not().notEmpty(),
                body("note", "Appointment_Note_Required").not().notEmpty(),

            ]
        }

        default:
            return "Somethong wan't wrong."
            break;
    }
}