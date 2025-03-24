import jwt from 'jsonwebtoken';
import config from "../envconfig/envVars.js";

/**
 * @Method Method used to check user token valide or not
 * @author Neeraj-Mehra
 * @param {*} message 
 * @date 24-March-2025
 */
const authMiddleware = async (req, res, next) => {
    let token = req.headers["x-access-token"] || req.headers.authorization;
    if (!token) {
        res.status(401).send({
            status: false,
            message: "Required authorization header not found.",
        });
        return;
    };

    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
    }

    const isVerified = jwt.verify(token, config.JWT_SECRET, (error, decoded) => {
        if (error) {
            res.status(401).send({
                status: false,
                message: "Token is not valid",
            });
        } else {
            req.user = decoded;
            next();
        }
    });
};

export default authMiddleware;
