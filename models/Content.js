const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContentSchema = new mongoose.Schema({

        name: {
            type: String,
            required: true
        },
        url: {
            type: String,
        },
        tradingFees:{
            type: String
        },
        assets: {
            type: String
        },
        currency:{
            type: String
        },
        promotion:{
            type: String
        },
        detail:{
            type: String
        },
        keyFeatures:{
            type: String
        },
        image:{
            type: String
        },
        easeOfUse:{
            type: Number
        },
        reputation:{
            type: Number
        },
        depositMethods:{
            type: Number
        },
        fees:{
            type: Number
        },
        notes:[
            {
                deviceId: { type: String },
                feedback:{ type: String },
                star:{ type: Number},
                date:{type: Date, default: Date.now}
            }],
        createdDate: {
            type: Date,
            default: Date.now,
        },
        countryId: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "country",
        }],
        stateId: [{
            type: mongoose.Schema.Types.ObjectId
        }],
        status: {
            type: String,
            default: "Active",
        },
    },
);

module.exports = Content = mongoose.model("content", ContentSchema , 'content');
