// ======================================================
// IMPORTS
// ======================================================

const Listing = require("./models/listing");
const Review = require("./models/reviews");
const { listingSchema, reviewSchema } = require("./schema");


// ======================================================
// VALIDATE LISTING
// ======================================================

module.exports.validateListing = (req, res, next) => {

    const { error } = listingSchema.validate(req.body);

    if (error) {

        const msg = error.details.map((el) => el.message).join(", ");

        req.flash("error", msg);

        // Instead of res.redirect("back")
        return res.redirect(req.get("Referrer") || "/listings");
    }

    next();
};


// ======================================================
// VALIDATE REVIEW
// ======================================================

module.exports.validateReview = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body);

    if (error) {

        const msg = error.details.map((el) => el.message).join(", ");

        req.flash("error", msg);

        // Instead of res.redirect("back")
        return res.redirect(req.get("Referrer") || "/listings");
    }

    next();
};


// ======================================================
// SAVE REDIRECT URL
// ======================================================

module.exports.saveRedirectUrl = (req, res, next) => {

    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
};


// ======================================================
// LOGIN CHECK
// ======================================================

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {

        req.session.redirectUrl = req.originalUrl;

        req.flash(
            "error",
            "You must be logged in first!"
        );

        return res.redirect("/login");
    }

    next();
};


// ======================================================
// LISTING OWNER AUTHORIZATION
// ======================================================

module.exports.isOwner = async (req, res, next) => {

    try {

        const { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {

            req.flash(
                "error",
                "Listing not found!"
            );

            return res.redirect("/listings");
        }

        if (!listing.owner.equals(req.user._id)) {

            req.flash(
                "error",
                "You don't have permission to perform this action."
            );

            return res.redirect(`/listings/${id}`);
        }

        next();

    } catch (err) {

        console.log(err);

        req.flash(
            "error",
            "Something went wrong."
        );

        return res.redirect("/listings");
    }

};


// ======================================================
// REVIEW OWNER AUTHORIZATION
// ======================================================

module.exports.isReviewAuthor = async (req, res, next) => {

    try {

        const { id, reviewId } = req.params;

        const review = await Review.findById(reviewId);

        if (!review) {

            req.flash(
                "error",
                "Review not found!"
            );

            return res.redirect(`/listings/${id}`);
        }

        if (!review.owner.equals(req.user._id)) {

            req.flash(
                "error",
                "You are not the author of this review."
            );

            return res.redirect(`/listings/${id}`);
        }

        next();

    } catch (err) {

        console.log(err);

        req.flash(
            "error",
            "Something went wrong."
        );

        return res.redirect("/listings");
    }

};