// ======================================================
// IMPORTS
// ======================================================

const express = require("express");

const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");

const reviewController = require("../controllers/reviews");

const {
    isLoggedIn,
    validateReview,
    isReviewAuthor
} = require("../middleware");


// ======================================================
// CREATE REVIEW
// ======================================================

router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);


// ======================================================
// DELETE REVIEW
// ONLY REVIEW AUTHOR CAN DELETE
// ======================================================

router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);


// ======================================================
// EXPORT
// ======================================================

module.exports = router;