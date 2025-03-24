//NPM
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
//Models
import userModel from "../../models/users.js";
//Response
import userResponse from "../../response/userResponse.js";
//Functions
import logger from '../../../logger.js';
import config from "../../helper/envconfig/envVars.js";
import { emailExist, getUserByEmail, getUserById } from "./service.js";
import { createJwtToken, getMessage } from "../../helper/common/helpers.js";
import { userType } from "../../helper/common/constant.js";


/**
 * @Method Method used to register new user in platform
 * @author Neeraj-Mehra
 * @param {*} req 
 * @param {*} res 
 * @date 24-March-2025
 */
export const userRegister = async (req, res) => {
    try {
        const { language = "en", userName, email, password, address, countryCode, phoneNumber, role } = req.body;

        //use validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send({
                status: false,
                message: await getMessage(language, errors.errors[0]["msg"]),
            })
        }
        //email valid regex
        let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(email)) {
            return res.send({
                status: false,
                message: await getMessage(language, "Invalid_Email_Address")
            });
        }

        //email convert in lower case
        const lowerEmail = email.toLowerCase();

        //function used to check email already exist or not
        const checkEmail = await emailExist(lowerEmail);
        if (checkEmail) {
            return res.send({
                status: false,
                message: await getMessage(language, "Email_Already_Exist"),
            });

        }

        const userObj = new userModel({
            userName: userName,
            email: lowerEmail,
            role: role,
            password: bcrypt.hashSync(password, 10),
            address: address || "",
            countryCode: countryCode || "",
            phoneNumber: phoneNumber
        });

        const userSave = await userObj.save();

        if (userSave) {
            //create jwt token
            const jwtToken = await createJwtToken({ id: userSave._id, email: lowerEmail, role: role });

            logger.info(`#####*****userRegister : user register success*****#####`);

            return res.status(200).send({
                status: true,
                token: jwtToken,
                message: await getMessage(language, "User_Register_Success"),
            })
        }

        logger.info(`#####*****userRegister : Feild to user register*****#####`);

        return res.send({
            status: false,
            message: await getMessage(language, "Feild_To_Register_User"),
        });

    } catch (error) {
        logger.error(`userRegister : Error==>> ${error.message}`)
        return res.send({
            status: false,
            message: error.message,
        })
    }
};

/**
 * @Method method used to user login by email and password
 * @param {*} req 
 * @param {*} res 
 * @date 24-March-2025
 */
export const userLogin = async (req, res) => {
    try {

        const { language, email, password } = req.body;

        //valifation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                status: false,
                message: await getMessage(language, errors.error[0]['msg']),
            })
        }
        //get user by email
        const checkUser = await getUserByEmail(email.toLowerCase());
        if (!checkUser) {
            return res.status(404).send({
                status: false,
                message: await getMessage(language, "User_Does_Not_Exist"),
            })
        }

        if (bcrypt.compareSync(password, checkUser.password)) {

            //generate jwt token
            const token = await createJwtToken({ id: checkUser._id });

            logger.info(`#####*****userLogin : user login success*****#####`);

            return res.status(200).send({
                status: true,
                message: await getMessage(language, "User_Login_Success"),
                token: token,
                data: new userResponse(checkUser),
            })
        } else {
            return res.status(400).send({
                status: false,
                message: await getMessage(language, "Envalid_Email_Password")
            })
        }
    } catch (error) {

        logger.info(`userLogin : Error==>> ${error.message}`);

        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

/**
 * @Method Method used to get user details
 * @param {*} req 
 * @param {*} res 
 * @date 24-March-2025
 */
export const getUserDetail = async (req, res) => {
    try {

        //decoded user id
        const userId = req.user.id;
        const language = req.query.language;

        //get user data by id
        const getUserData = await getUserById(userId);

        if (getUserData) {
            return res.send({
                status: true,
                message: await getMessage(language, "Get_User_Details_Success"),
                data: new userResponse(getUserData),
            })
        }

        return res.send({
            status: false,
            message: await getMessage(language, "Data_Not_Found"),
        });

    } catch (error) {
        return res.send({
            status: false,
            message: error.message
        })
    }
};

/**
 * @Method Method used to get all user in the system list with filter and pagination
 * @param {*} req 
 * @param {*} res 
 * @date 24-March-2025
 */
export const getUserList = async (req, res) => {
    try {
        const { language, search, page = 1, perPage = 10, role } = req.body;

        //pagination
        const pageNo = (page - 1) * perPage;

        let filter = {};
        //search filter
        if (search) {
            const reg = {
                userName: { $regex: ".*" + search + ".*", $options: "i" }
            };

            filter = Object.assign(filter, reg);
        }
        if (role) {
            const userRole = {
                role: { $in: [role] }
            };

            filter = Object.assign(filter, userRole);
        }
        //get user list
        const getAllUsers = await userModel.find(filter)
            .sort({ _id: -1 })
            .skip(pageNo)
            .limit(perPage);

        if (getAllUsers && getAllUsers.length) {
            const madeUserResponse = await Promise.all(getAllUsers.map(async (user) => {
                return new userResponse(user);
            })//map
            )//promise

            //get total count
            const totalCount = await userModel.countDocuments(filter);

            return res.status(200).send({
                status: true,
                message: await getMessage(language, "User_List_Fetched_Success"),
                totalCount: totalCount,
                data: madeUserResponse,

            })
        } else {
            return res.send({
                status: false,
                message: await getMessage(language, "Data_Not_Found"),
                data: []
            })
        }

    } catch (error) {

        return res.status(500).send({
            status: false,
            message: error.message,
        })
    }
}

/**
 * @Method Method used to get all user list with filter and pagination (if user role is patient(showing all docter list), If user role is docter(showing all patient list))
 * @param {*} req 
 * @param {*} res 
 * @date 24-March-2025
 */
export const getPatientDoctorsList = async (req, res) => {
    try {
        const {
            language = "en",
            search = "",
            page = 1,
            perPage = 10,
        } = req.body;

        const currentPage = parseInt(page);
        const limit = parseInt(perPage);
        const skip = (currentPage - 1) * limit;

        //decode user role if user role is patient(showing all docter list), If user role is docter(showing all patient list);
        const role = req.user.role;
        let filterRole;
        if (role == userType.patient) {
            filterRole = userType.docter;
        } else {
            filterRole = userType.patient;
        };

        // Build filter
        const filter = {};
        if (search) {
            filter.userName = { $regex: `.*${search}.*`, $options: "i" };
        }
        if (filterRole) {
            filter.role = filterRole; // role: 'doctor' or 'patient'
        }

        // Fetch users with pagination
        const users = await userModel.find(filter)
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit);

        const totalCount = await userModel.countDocuments(filter);

        if (!users.length) {
            return res.status(404).json({
                status: false,
                message: await getMessage(language, "Data_Not_Found"),
                data: []
            });
        }

        const formattedUsers = await Promise.all(
            users.map(user => new userResponse(user))
        );

        return res.status(200).json({
            status: true,
            message: await getMessage(language, "User_List_Fetched_Success"),
            totalCount,
            data: formattedUsers
        });

    } catch (error) {
        console.error("Error in getUserList:", error.message);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};
