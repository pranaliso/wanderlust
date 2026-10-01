const mongoose = require("mongoose");

const Listing = require("../models/listing");
const User = require("../models/user");

const { cloudinary } = require("../cloudConfig");

const geocode = require("../utils/geocode");





// ======================================
// SHOW ALL LISTINGS + SEARCH + FILTER
// ======================================

module.exports.index = async (req, res) => {

    try {

        let filter = {};

        // CATEGORY FILTER
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // SEARCH FILTER
        if (req.query.search) {

            filter.$or = [

                {
                    title: {
                        $regex: req.query.search,
                        $options: "i",
                    },
                },

                {
                    location: {
                        $regex: req.query.search,
                        $options: "i",
                    },
                },

                {
                    country: {
                        $regex: req.query.search,
                        $options: "i",
                    },
                },

            ];

        }

        const allListings = await Listing.find(filter).populate("owner");

        // ===========================
        // LOAD USER WISHLIST
        // ===========================

        let wishlist = [];

        if (req.user) {

            const user = await User.findById(req.user._id);

            wishlist = user.wishlist.map(item => item.toString());

        }

        res.render("listings/index", {
            allListings,
            wishlist,
        });

    }

    catch (err) {

        console.log(err);

        req.flash("error", "Unable to load listings");

        res.redirect("/");

    }

};











// ======================================
// NEW LISTING FORM
// ======================================


module.exports.renderNewForm = (req,res)=>{


    res.render(

        "listings/new"

    );


};











module.exports.createListing = async (req, res) => {

    try {

        console.log("========== CREATE LISTING ==========");
        console.log("BODY:");
        console.log(req.body);

        console.log("FILE:");
        console.log(req.file);

        console.log("USER:");
        console.log(req.user);

        const newListing = new Listing(req.body.listing || {});

        console.log("NEW LISTING:");
        console.log(newListing);

        // CLOUDINARY IMAGE
        if (req.file) {
            newListing.image = {
                url: req.file.path,
                filename: req.file.filename,
            };
        }

        // GEOCODING
        const coordinates = await geocode(
            `${newListing.location}, ${newListing.country}`
        );

        if (coordinates) {
            newListing.geometry = {
                type: "Point",
                coordinates: [
                    coordinates.longitude,
                    coordinates.latitude,
                ],
            };
        }

        // OWNER
        newListing.owner = req.user._id;

        await newListing.save();

        req.flash("success", "Listing created successfully");
        res.redirect("/listings");

    } catch (err) {

        console.log("ERROR:");
        console.log(err);

        req.flash("error", "Something went wrong");
        res.redirect("/listings/new");
    }
};



// ======================================
// SHOW SINGLE LISTING
// ======================================

module.exports.showListing = async (req, res) => {

    console.log("==================================");
    console.log("URL:", req.originalUrl);
    console.log("ID :", req.params.id);
    console.log("==================================");

    const { id } = req.params;

    // Check if ObjectId is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {

        console.log("Invalid ObjectId:", id);

        req.flash("error", "Invalid Listing ID");
        return res.redirect("/listings");
    }

    const listing = await Listing.findById(id)
        .populate("owner")
        .populate({
            path: "reviews",
            populate: {
                path: "owner",
            },
        });

    if (!listing) {

        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    res.render("listings/show", {
        listing,
    });
};



// ======================================
// EDIT FORM
// ======================================


module.exports.renderEditForm = async(req,res)=>{


    const listing = await Listing.findById(

        req.params.id

    );





    if(!listing){


        req.flash(

            "error",

            "Listing not found"

        );


        return res.redirect("/listings");


    }







    res.render(

        "listings/edit",

        {

            listing

        }

    );


};












// ======================================
// UPDATE LISTING
// ======================================


module.exports.updateListing = async(req,res)=>{


    try{


        const {id}=req.params;





        let listing = await Listing.findById(id);







        if(!listing){


            req.flash(

                "error",

                "Listing not found"

            );


            return res.redirect("/listings");


        }









        // UPDATE TEXT DATA


        await Listing.findByIdAndUpdate(

            id,


            req.body.listing,


            {

                runValidators:true

            }


        );









        // UPDATE GEOLOCATION


        const coordinates = await geocode(

            `${req.body.listing.location}, ${req.body.listing.country}`

        );







        if(coordinates){


            listing.geometry = {


                type:"Point",


                coordinates:[


                    coordinates.longitude,


                    coordinates.latitude


                ]



            };


        }








        // UPDATE IMAGE


        if(req.file){



            if(listing.image.filename){


                await cloudinary.uploader.destroy(

                    listing.image.filename

                );


            }





            listing.image = {


                url:req.file.path,


                filename:req.file.filename


            };



        }







        await listing.save();







        req.flash(

            "success",

            "Listing updated successfully"

        );





        res.redirect(

            `/listings/${id}`

        );




    }

    catch(err){


        console.log(err);


        req.flash(

            "error",

            "Update failed"

        );


        res.redirect("/listings");


    }



};












// ======================================
// DELETE LISTING
// ======================================


module.exports.destroyListing = async(req,res)=>{


    try{


        const listing = await Listing.findById(

            req.params.id

        );





        if(!listing){


            req.flash(

                "error",

                "Listing not found"

            );


            return res.redirect("/listings");


        }








        // DELETE CLOUDINARY IMAGE


        if(listing.image && listing.image.filename){


            await cloudinary.uploader.destroy(

                listing.image.filename

            );


        }







        await Listing.findByIdAndDelete(

            req.params.id

        );







        req.flash(

            "success",

            "Listing deleted successfully"

        );






        res.redirect("/listings");




    }

    catch(err){


        console.log(err);


        req.flash(

            "error",

            "Delete failed"

        );


        res.redirect("/listings");


    }



};
// ======================================
// MY LISTINGS
// ======================================

module.exports.myListings = async (req, res) => {

    try {

        const allListings = await Listing.find({
            owner: req.user._id,
        });

        res.render("listings/my", {
            allListings,
        });

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to load your listings");

        res.redirect("/listings");

    }

};