import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },
    status: { type: String, enum: [1, 2], default: 1 },//"1-booked", "2-cancelled"
    notes: { type: String },

}, { timestamps: true });

const appointmentModel = mongoose.model("Appointment", appointmentSchema);

export default appointmentModel;
