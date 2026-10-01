const User = require("../models/user");
const Listing = require("../models/listing");
const passport = require("passport");



// ======================================
// SIGNUP FORM
// ======================================

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup");
};



// ======================================
// SIGNUP
// ======================================

module.exports.signup = async (req, res, next) => {

    try {

        const { username, email, password } = req.body;

        const newUser = new User({
            email,
            username,
        });

        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {

            if (err) return next(err);

            req.flash("success", "Welcome to WanderLust!");

            const redirectUrl =
                req.session.redirectUrl || "/listings";

            delete req.session.redirectUrl;

            res.redirect(redirectUrl);

        });

    } catch (err) {

        req.flash("error", err.message);

        res.redirect("/signup");

    }

};



// ======================================
// LOGIN FORM
// ======================================

module.exports.renderLoginForm = (req, res) => {

    res.render("users/login");

};



// ======================================
// LOGIN
// ======================================

module.exports.login = (req, res) => {

    req.flash("success", "Welcome Back!");

    const redirectUrl =
        req.session.redirectUrl || "/listings";

    delete req.session.redirectUrl;

    res.redirect(redirectUrl);

};



// ======================================
// LOGOUT
// ======================================

module.exports.logout = (req, res, next) => {

    req.logout((err) => {

        if (err) {
            return next(err);
        }

        req.flash("success", "Logged Out Successfully!");

        res.redirect("/listings");

    });

};



// ======================================
// ADD TO WISHLIST
// ======================================

module.exports.addToWishlist = async (req, res) => {

    const { id } = req.params;

    const user = await User.findById(req.user._id);

    if (!user.wishlist.includes(id)) {

        user.wishlist.push(id);

        await user.save();

        req.flash("success", "Added to Wishlist ❤️");

    }

    res.redirect(`/listings/${id}`);

};



// ======================================
// REMOVE FROM WISHLIST
// ======================================

module.exports.removeFromWishlist = async (req, res) => {

    const { id } = req.params;

    await User.findByIdAndUpdate(

        req.user._id,

        {
            $pull: {
                wishlist: id,
            },
        }

    );

    req.flash("success", "Removed from Wishlist");

    res.redirect(`/listings/${id}`);

};



// ======================================
// SHOW MY WISHLIST
// ======================================

module.exports.showWishlist = async (req, res) => {

    const user = await User.findById(req.user._id)
        .populate("wishlist");

    res.render("users/wishlist", {

        wishlist: user.wishlist,

    });

};
// ======================================
// USER PROFILE
// ======================================

module.exports.profile = async (req, res) => {

    const user = await User.findById(req.user._id)
        .populate("wishlist");

    const myListings = await Listing.find({
        owner: req.user._id,
    });

    res.render("users/profile", {
        user,
        myListings,
    });

};