const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CountrySchema = new mongoose.Schema({

        name: {
            type: String,
            required: true
        },
        states:[{
                name : String
            }],
        createdDate: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            default: "Active",
        }
    }
);

module.exports = Country = mongoose.model("country", CountrySchema , 'country');
