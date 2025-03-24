import appointmentModel from "../../models/appointment.js";

/**
 * @Method Method booking is alredy booked
 * @author Neeraj-Mehra
 * @date 24-March-2025
 */
export const checkAppointment = async (doctorId, appointmentDate, appointmentTime) => {
    try {
        const date = new Date(appointmentDate);

        // Check for existing appointment conflict
        const existingAppointment = await appointmentModel.findOne({
            doctor: doctorId,
            appointmentDate: date,
            appointmentTime: appointmentTime,
            status: 1
        });

        if (existingAppointment) {
            return { status: false, message: "Appointment not available at the selected time." };
        } else {
            return { status: true, message: "Appointment not available at the selected time." };
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * @Method method used to get appointment by user and id
 * @param {*} id, userId 
 * @date 24-March-2025
 */
export const getAppointmentById = async (appointmentId, userId) => {
    try {
        //get user by email
        const getAppointments = await appointmentModel.findOne({ _id: appointmentId, patient: userId });

        return getAppointments;

    } catch (error) {
        throw new Error(error.message);
    }
}