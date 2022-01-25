const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AboutUsSchema = new mongoose.Schema({

        content: {
            type: String,
            required: true
        },
        createdDate: {
            type: Date,
            default: Date.now,
        },
        updatedDate:{
            type: Date
        }
    },
);

module.exports = AboutUs = mongoose.model("aboutUs", AboutUsSchema , 'aboutUs');
