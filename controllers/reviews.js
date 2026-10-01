// ======================================================
// IMPORTS
// ======================================================

const Listing = require("../models/listing");
const Review = require("../models/reviews");


// ======================================================
// CREATE REVIEW
// ======================================================

module.exports.createReview = async (req, res) => {

    const { id } = req.params;

    // Find Listing
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // Create Review
    const review = new Review(req.body.review);

    // Logged-in user becomes owner
    review.owner = req.user._id;

    // Add review to listing
    listing.reviews.push(review);

    // Save both
    await review.save();
    await listing.save();

    req.flash("success", "Review Added Successfully!");

    res.redirect(`/listings/${id}`);
};


// ======================================================
// DELETE REVIEW
// ======================================================

module.exports.destroyReview = async (req, res) => {

    const { id, reviewId } = req.params;

    // Check listing
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // Check review
    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }

    // Remove review reference from listing
    await Listing.findByIdAndUpdate(
        id,
        {
            $pull: {
                reviews: reviewId
            }
        }
    );

    // Delete review
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted Successfully!");

    res.redirect(`/listings/${id}`);
};