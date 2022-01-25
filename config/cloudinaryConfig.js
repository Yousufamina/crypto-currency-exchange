const { config, uploader } = require("cloudinary");
const dotenv =  require("dotenv");
dotenv.config();
const cloudinaryConfig = (req, res, next) => {
    config({
        cloud_name: "onlinecasino2",
        api_key: "851284965218135",
        api_secret: "SHSCLjDYF7i8eoDx1KATvqIeBpw",
    });
    next();
}
module.exports = {cloudinaryConfig, uploader} ;