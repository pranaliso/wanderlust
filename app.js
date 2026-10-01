// ====================== IMPORTS ======================

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");



// ====================== APP ======================

const app = express();




// ====================== MODELS ======================

const User = require("./models/user");
const Listing = require("./models/listing");
const initData = require("./init/data");




// ====================== ROUTES ======================

const listingRouter = require("./routes/listings");
const reviewRouter = require("./routes/reviews");
const userRouter = require("./routes/users");




// ====================== DATABASE ======================

const MONGO_URL =
process.env.MONGO_URL ||
"mongodb://127.0.0.1:27017/wander";



async function main(){

    await mongoose.connect(MONGO_URL);

}



main()
.then(()=>{

    console.log("✅ MongoDB Connected");

})
.catch((err)=>{

    console.log(
        "MongoDB Connection Error",
        err
    );

});





// ====================== VIEW ENGINE ======================


app.engine(
    "ejs",
    ejsMate
);


app.set(
    "view engine",
    "ejs"
);


app.set(
    "views",
    path.join(__dirname,"views")
);







// ====================== MIDDLEWARE ======================


app.use(
    express.urlencoded({
        extended:true
    })
);


app.use(
    express.json()
);



app.use(
    methodOverride("_method")
);



app.use(
    express.static(
        path.join(__dirname,"public")
    )
);








// ====================== MONGO SESSION STORE ======================


const store = MongoStore.create({


    mongoUrl:MONGO_URL,


    crypto:{


        secret:
        process.env.SECRET || "mysupersecretcode"


    },


    touchAfter:24 * 3600


});




store.on(
    "error",
    (err)=>{


        console.log(
            "SESSION STORE ERROR",
            err
        );


    }
);








// ====================== SESSION ======================


const sessionOptions = {


    store,


    secret:
    process.env.SECRET || "mysupersecretcode",


    resave:false,


    saveUninitialized:false,


    cookie:{


        expires:new Date(

            Date.now()
            +
            7*24*60*60*1000

        ),



        maxAge:

        7*24*60*60*1000,



        httpOnly:true


    }


};




app.use(
    session(sessionOptions)
);



app.use(
    flash()
);









// ====================== PASSPORT ======================


app.use(
    passport.initialize()
);


app.use(
    passport.session()
);




passport.use(

    new LocalStrategy(

        User.authenticate()

    )

);




passport.serializeUser(
    User.serializeUser()
);



passport.deserializeUser(
    User.deserializeUser()
);

// ====================== GLOBAL VARIABLES ======================

app.use(async (req, res, next) => {

    // Flash Messages
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

    // Logged-in User
    res.locals.currentUser = req.user;

    // Current Request
    res.locals.request = req;

    // ❤️ User Wishlist
    if (req.user) {

        const user = await User.findById(req.user._id);

        res.locals.wishlist = user.wishlist.map((id) =>
            id.toString()
        );

    } else {

        res.locals.wishlist = [];

    }

    next();

});








// ====================== HOME ======================


app.get(
"/",

(req,res)=>{


    res.render("home");


}

);









// ====================== ROUTES ======================


app.use(
"/listings",
listingRouter
);



app.use(
"/listings/:id/reviews",
reviewRouter
);



app.use(
"/",
userRouter
);









// ====================== SAMPLE DATA ======================


app.get(

"/initListings",

async(req,res)=>{


    await Listing.deleteMany({});



    const user =
    await User.findOne({});



    const listings =
    initData.data.map(obj=>({


        ...obj,


        owner:user._id


    }));



    await Listing.insertMany(
        listings
    );



    req.flash(

        "success",

        "Sample Data Added"

    );



    res.redirect(
        "/listings"
    );


}

);









// ====================== 404 ERROR ======================


app.use(

(req,res)=>{


    req.flash(

        "error",

        "Page Not Found"

    );


    res.redirect(
        "/listings"
    );


}

);









// ====================== SERVER ======================


const PORT =
process.env.PORT || 8080;



app.listen(

PORT,

()=>{


console.log(

`🚀 Server running on port ${PORT}`

);


}

);