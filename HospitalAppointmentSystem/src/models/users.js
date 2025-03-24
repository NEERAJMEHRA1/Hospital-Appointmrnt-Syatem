import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: { type: String, default: "" },
    email: { type: String, require: true },
    password: { type: String, require: true },
    phoneNumber: { type: String, default: "" },
    countryCode: { type: String, default: "" },
    address: { type: String, default: "" },
    role: { type: Number, enum: [1, 2, 3], required: true },//"admin", "doctor", "patient"
},
    {
        timestamps: true,
        typeCast: true
    }
);

const userModel = mongoose.model("users", userSchema);

export default userModel;
