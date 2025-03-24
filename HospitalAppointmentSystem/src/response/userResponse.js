import config from "../helper/envconfig/envVars.js";

class userResponse {
    constructor(instant) {
        this.userId = instant._id ? instant._id : '';
        this.userName = instant.userName ? instant.userName : '';
        this.email = instant.email ? instant.email : '';
        this.userRole = instant.role ? instant.role : null;
        this.countryCode = instant.countryCode ? instant.countryCode : '';
        this.phoneNumber = instant.phoneNumber ? instant.phoneNumber : '';
        this.address = instant.address ? instant.address : '';
        this.profileImage = instant.profileImage ? config.IMAGE_ACCESS_URL + instant.profileImage : '';
        this.createdAt = instant.createdAt ? instant.createdAt : '';
    }
};

export default userResponse;