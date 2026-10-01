const Listing = require("./models/listing");
const Review = require("./models/reviews");

const { listingSchema, reviewSchema } = require("./schema");

// ===============================
// LOGIN CHECK
// ===============================

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {

        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "You must be logged in first!");

        return res.redirect("/login");
    }

    next();
};

// ===============================
// SAVE REDIRECT URL
// ===============================

module.exports.saveRedirectUrl = (req, res, next) => {

    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
};

// ===============================
// VALIDATE LISTING
// ===============================

module.exports.validateListing = (req, res, next) => {

    const { error } = listingSchema.validate(req.body);

    if (error) {

        const msg = error.details.map(el => el.message).join(",");

        req.flash("error", msg);

        return res.redirect("/listings/new");
    }

    next();
};

// ===============================
// VALIDATE REVIEW
// ===============================

module.exports.validateReview = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body);

    if (error) {

        const msg = error.details.map(el => el.message).join(",");

        req.flash("error", msg);

        return res.redirect("back");
    }

    next();
};

// ===============================
// LISTING OWNER CHECK
// ===============================

module.exports.isOwner = async (req, res, next) => {

    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {

        req.flash("error", "Listing not found");

        return res.redirect("/listings");
    }

    if (!listing.owner.equals(req.user._id)) {

        req.flash("error", "You don't have permission.");

        return res.redirect(`/listings/${id}`);
    }

    next();
};

// ===============================
// REVIEW OWNER CHECK
// ===============================

module.exports.isReviewAuthor = async (req, res, next) => {

    const { reviewId, id } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {

        req.flash("error", "Review not found");

        return res.redirect(`/listings/${id}`);
    }

    if (!review.owner.equals(req.user._id)) {

        req.flash("error", "You are not the review author.");

        return res.redirect(`/listings/${id}`);
    }

    next();
};