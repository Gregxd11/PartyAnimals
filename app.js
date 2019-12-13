const methodOverride = require("method-override"),
    LocalStrategy    = require("passport-local"),
    bodyParser       = require("body-parser"),
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
    animalRoutes     = require("./routes/animals"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index")
    

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


//Profile index
app.get("/profiles", function(req, res){
    User.find({}, function (err, allUsers) {
        if (err) {
            console.log(err)
        } else {
            res.render("profiles/index", {users: allUsers });
        }
    })
});

//PROFILE SHOW
app.get("/profiles/:id", function(req, res){
    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            console.log(err)
        } else {
            res.render("profiles/show", {user: foundUser });
        }
    });
});


//EDIT Route
app.get("/profiles/:id/edit", function(req, res){
    res.render("profiles/edit")
});

//update route
app.put("/profiles/:id", function(req,res){
    User.findByIdAndUpdate(req.params.id, req.body.user, {new: true}, function (err, updatedUser) {
        if (err) {
            res.redirect("/animals");
        } else {
            res.redirect("/profiles/" + req.params.id);
        }
    });
});

//Destroy route
app.delete("/profiles/:id", function(req, res){
    User.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/animals");
        } else {
            req.flash("success", "Profile successfully deleted.");
            res.redirect("/profiles");
        }
    })
});

// RUN SERVER
app.listen(port, () =>{
    console.log("PartyAnimals server started");
});

