const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PositionSchema = new mongoose.Schema({

        position: [],
    },
);

module.exports = Position = mongoose.model("position", PositionSchema , 'position');
