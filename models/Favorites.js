const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FavoritesSchema = new mongoose.Schema({

        deviceId: {
            type: String,
            required: true
        },
        favorites:
        [
            {
                contentId: {
                    type: Schema.Types.ObjectId,
                    ref: "content",
                }
            },
        ],
        createdDate: {
            type: Date,
            default: Date.now,
        },
    },
);

module.exports = Favorites = mongoose.model("favorites", FavoritesSchema , 'favorites');
