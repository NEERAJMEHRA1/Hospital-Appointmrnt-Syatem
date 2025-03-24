

/**
 * @Method Use For check login authentication
 * @author Neeraj-Mehra
 * @date 24-March-2025
 */
export const loginAuth = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];

    console.log("token===" + process.env.LOGIN_BEARER);

    if (bearerHeader) {
        const bearer = bearerHeader.split(" ");

        if (bearer.length > 1) {
            const bearerToken = bearer[1];
            if (bearerToken == process.env.LOGIN_BEARER) {
                return next();
            }
        }
    }
    console.log("receive token== " + bearerHeader);
    res.sendStatus(403);
};
