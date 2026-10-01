const express = require("express");
const passport = require("passport");

const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");

const userController = require("../controllers/users");

const { isLoggedIn } = require("../middleware");

// ======================================
// SIGNUP
// ======================================

router
.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

// ======================================
// LOGIN
// ======================================

router
.route("/login")
.get(userController.renderLoginForm)
.post(
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    userController.login
);

// ======================================
// LOGOUT
// ======================================

router.get(
    "/logout",
    userController.logout
);

// ======================================
// WISHLIST PAGE
// ======================================

router.get(
    "/wishlist",
    isLoggedIn,
    wrapAsync(userController.showWishlist)
);

// ======================================
// ADD TO WISHLIST
// ======================================

router.post(
    "/wishlist/:id",
    isLoggedIn,
    wrapAsync(userController.addToWishlist)
);

// ======================================
// REMOVE FROM WISHLIST
// ======================================

router.delete(
    "/wishlist/:id",
    isLoggedIn,
    wrapAsync(userController.removeFromWishlist)
);

// ======================================
// USER PROFILE
// ======================================

router.get(
    "/profile",
    isLoggedIn,
    wrapAsync(userController.profile)
);

// ======================================
// EXPORT
// ======================================

module.exports = router;