const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FaqSchema = new mongoose.Schema({

        question: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true
        },
        createdDate: {
            type: Date,
            default: Date.now,
        },
    },
);

module.exports = Faq = mongoose.model("faq", FaqSchema , 'faq');
