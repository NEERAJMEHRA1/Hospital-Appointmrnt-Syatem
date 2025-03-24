import jwt from "jsonwebtoken";
import config from "../envconfig/envVars.js";
import { languageSupport } from "./constant.js";
import MESSAGES_DATA from "../language/english.js";

/**
 * @Method Method used to generate jwt token
 * @author Neeraj-Mehra
 * @param {*} data 
 * @date 24-March-2025
 */
export const createJwtToken = async (data) => {
    try {
        const token = jwt.sign(data, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRE });

        return token;

    } catch (error) {
        return error.message;
    }
};

/**
 * @Method Method used to get response message
 * @author Neeraj-Mehra
 * @param {*} message 
 * @date 24-March-2025
 */
export const getMessage = async (language, message) => {
    if (language == languageSupport.english) {
        const englishMessage = await MESSAGES_DATA[message];
        return englishMessage;
    } else {
        const otherMessgae = await MESSAGES_DATA[message];
        return otherMessgae;
    }
}
