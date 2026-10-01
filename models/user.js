const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema(
{
    username: {
        type: String,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    profileImage: {
        type: String,
        default: "https://i.imgur.com/6VBx3io.png",
    },

    bio: {
        type: String,
        default: "Traveller at WanderLust 🌍",
    },

    phone: {
        type: String,
        default: "",
    },

    location: {
        type: String,
        default: "",
    },

    // ❤️ Wishlist
    wishlist: [
        {
            type: Schema.Types.ObjectId,
            ref: "Listing",
        },
    ],
},
{
    timestamps: true,
}
);

// Passport Plugin
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);