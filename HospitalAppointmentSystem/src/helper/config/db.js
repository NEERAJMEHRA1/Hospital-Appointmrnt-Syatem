import mongoose from "mongoose";
import config from "../envconfig/envVars.js";

const dbUrl = `mongodb://${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`;

const connect = mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("DB Connected"))
    .catch((error) => console.log("Error==>> ", error));

export default connect;