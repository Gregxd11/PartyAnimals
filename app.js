const methodOverride = require("method-override"),
    LocalStrategy    = require("passport-local"),
    bodyParser       = require("body-parser"),
    middleware       = require("./middleware"),
    mongoose         = require("mongoose"),
    passport         = require("passport"),
    express          = require("express"),
    seedDB           = require("./seeds"),
    flash            = require("connect-flash"),
    port             = process.env.PORT || 3000,
    url              = process.env.DATABASEURL || "mongodb://localhost/yelp_camp"
    app              = express(),
    //Object models
    Comment          = require("./models/comment"),
    Animal           = require("./models/animal"),
    User             = require("./models/user"),
    //Routes
    commentRoutes    = require("./routes/comments"),
    profileRoutes    = require("./routes/profiles"),
    animalRoutes     = require("./routes/animals"),
    indexRoutes      = require("./routes/index")
    mongoose.Promise = global.Promise

mongoose.connect(url, { 
    useNewUrlParser: true,
    useUnifiedTopology: true, 
    useFindAndModify: false
    }
);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: "Red pandas are the best animal",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


//ROUTES
app.use(indexRoutes);
app.use("/animals", animalRoutes);
app.use("/animals/:id/comments", commentRoutes);
app.use("/profiles", profileRoutes);

// RUN SERVER
app.listen(port, () =>{
    console.log("PartyAnimals server started");
});

