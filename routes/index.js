const express = require("express"),
    router    = express.Router(),
    passport  = require("passport"),
    User      = require("../models/user")

//root route
router.get("/", function (req, res) {
    res.render("landing");
})

//show register form
router.get('/register', function (req, res) {
    res.render('register')
});
//handle sign up logic
router.post('/register', function (req, res) {
    let newUser = new User({ username: req.body.username, image: req.body.image, location: req.body.location })
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            return res.render('register', {error: err.message});
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to PartyAnimals " + user.username);
            res.redirect('/animals');
        });
    });
});

//show login form
router.get('/login', function (req, res) {
    res.render('login');
});

// log user in
router.post('/login', passport.authenticate("local",
    {
        successRedirect: "/animals",
        successFlash: "Successfully logged in",
        failureRedirect: "/login",
        failureFlash: "Invalid username or password"
    }), function (req, res) {
    });

// LOG OUT ROUTE
router.get('/logout', function (req, res) {
    req.logout();
    req.flash("success", "Logged out");
    res.redirect('/animals');
});

module.exports = router;