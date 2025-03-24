import dotenv from "dotenv";
dotenv.config();

const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    DB_NAME: process.env.DB_NAME,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE,
    IMAGE_ACCESS_URL: process.env.IMAGE_ACCESS_URL,
};

export default envVars;