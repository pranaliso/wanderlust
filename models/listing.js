const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Reviews = require("./reviews.js");

const listingSchema = new Schema({

    // ================================
    // TITLE
    // ================================

    title: {
        type: String,
        required: true,
    },

    // ================================
    // DESCRIPTION
    // ================================

    description: {
        type: String,
        required: true,
    },

    // ================================
    // CATEGORY
    // ================================

    category: {
        type: String,
        enum: [
            "Beach",
            "Mountain",
            "City",
            "Camping",
            "Castle",
            "Island",
        ],
        required: true,
    },

    // ================================
    // IMAGE
    // ================================

    image: {
        filename: {
            type: String,
            default: "listingimage",
        },

        url: {
            type: String,
            default:
                "https://images.unsplash.com/photo-1548446803-b50df9f8ce7a?auto=format&fit=crop&w=1000&q=80",
        },
    },

    // ================================
    // PRICE
    // ================================

    price: {
        type: Number,
        required: true,
        min: 0,
    },

    // ================================
    // LOCATION
    // ================================

    location: {
        type: String,
        required: true,
    },

    // ================================
    // COUNTRY
    // ================================

    country: {
        type: String,
        required: true,
    },

    // ================================
    // MAP LOCATION
    // ================================

    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },

        coordinates: {
            type: [Number],
            default: [0, 0],
        },
    },

    // ================================
    // CREATED DATE
    // ================================

    createdAt: {
        type: Date,
        default: Date.now,
    },

    // ================================
    // REVIEWS
    // ================================

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Reviews",
        },
    ],

    // ================================
    // OWNER
    // ================================

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

});

// ================================
// GEO SEARCH INDEX
// ================================

listingSchema.index({
    geometry: "2dsphere",
});

// ================================
// DELETE REVIEWS AFTER LISTING DELETE
// ================================

listingSchema.post("findOneAndDelete", async function (listing) {

    if (listing) {

        await Reviews.deleteMany({
            _id: {
                $in: listing.reviews,
            },
        });

    }

});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;