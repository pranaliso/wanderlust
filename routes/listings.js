// ======================================================
// IMPORTS
// ======================================================

const express = require("express");
const router = express.Router();

const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

const wrapAsync = require("../utils/wrapAsync");
const listingController = require("../controllers/listings");

const {
    isLoggedIn,
    isOwner,
    validateListing,
} = require("../middleware");

// ======================================================
// ALL LISTINGS
// ======================================================

router.get(
    "/",
    wrapAsync(listingController.index)
);

// ======================================================
// MY LISTINGS
// ======================================================

router.get(
    "/my",
    isLoggedIn,
    wrapAsync(listingController.myListings)
);

// ======================================================
// NEW LISTING FORM
// ======================================================

router.get(
    "/new",
    isLoggedIn,
    listingController.renderNewForm
);

// ======================================================
// CREATE LISTING
// ======================================================

router.post(
    "/",
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
);

// ======================================================
// EDIT LISTING FORM
// MUST COME BEFORE "/:id"
// ======================================================

router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    (req, res, next) => {
        console.log("========== EDIT ROUTE ==========");
        console.log(req.originalUrl);
        console.log(req.params.id);
        next();
    },
    wrapAsync(listingController.renderEditForm)
);
// ======================================================
// UPDATE LISTING
// ======================================================

router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
);

// ======================================================
// DELETE LISTING
// ======================================================

router.delete(
    "/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
);

// ======================================================
// SHOW SINGLE LISTING
// KEEP THIS LAST
// ======================================================

router.get(
    "/:id",
    wrapAsync(listingController.showListing)
);

// ======================================================
// EXPORT
// ======================================================

module.exports = router;