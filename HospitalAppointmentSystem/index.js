
import http from "http";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import database from "./src/helper/config/db.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import swaggerUi from "swagger-ui-express";
const swaggerDoc = require("./swagger.json");
import userRouter from "./src/api/user/index.js";
import bookingRouter from "./src/api/booking/index.js";
import logger from "./logger.js";

const app = express();
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));

//swagger set up
app.use('/has-apis', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use("/users", userRouter);
app.use("/booking", bookingRouter);

const corsOption = {
    origin: "*",
    Credential: true,
    optionsSuccessStatus: 200
}
app.use(cors(corsOption));
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    console.log("Hello Neeraj");
    res.send("Hello this is testing server.")
})
//server connection
const server = http.createServer(app).listen(port, () => {
    logger.info(`Server running at : http://localhost:${port}`);
});
database;
