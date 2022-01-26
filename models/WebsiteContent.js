const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WebsiteContentSchema = new mongoose.Schema({

        heading:{
            type: String
        },
        description:{
            type: String
        },
        image:{
            type: String
        },
        createdDate: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            default: "Active",
        },
    },
);

module.exports = WebsiteContent = mongoose.model("WebsiteContentSchema", WebsiteContentSchema , 'WebsiteContent');
