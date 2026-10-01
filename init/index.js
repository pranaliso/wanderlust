const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wander";

// ====================== CONNECT DATABASE ======================

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(async () => {
        console.log("MongoDB connected successfully");
        await initDB();
        mongoose.connection.close();
    })
    .catch((err) => {
        console.log(err);
    });

// ====================== INITIALIZE DATABASE ======================

async function initDB() {
    try {
        await Listing.deleteMany({});
        console.log("Old listings deleted");

        const listings = initData.data.map((listing) => ({
            ...listing,
            category: getCategory(listing),
        }));

        await Listing.insertMany(listings);

        console.log("Initial listings inserted successfully");
    } catch (err) {
        console.log(err);
    }
}

// ====================== CATEGORY FUNCTION ======================

function getCategory(listing) {

    const text = (
        listing.title +
        " " +
        listing.description +
        " " +
        listing.location
    ).toLowerCase();

    if (
        text.includes("beach") ||
        text.includes("ocean") ||
        text.includes("sea") ||
        text.includes("coast")
    ) {
        return "Beach";
    }

    if (
        text.includes("mountain") ||
        text.includes("cabin") ||
        text.includes("hill") ||
        text.includes("retreat")
    ) {
        return "Mountain";
    }

    if (
        text.includes("camp") ||
        text.includes("treehouse")
    ) {
        return "Camping";
    }

    if (
        text.includes("castle") ||
        text.includes("villa") ||
        text.includes("historic")
    ) {
        return "Castle";
    }

    if (
        text.includes("island")
    ) {
        return "Island";
    }

    return "City";
}