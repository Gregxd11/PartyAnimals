const express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    middleware = require("../middleware")

//Profile index
router.get("/", function (req, res) {
    User.find({}, function (err, allUsers) {
        if (err) {
            console.log(err)
        } else {
            res.render("profiles/index", { users: allUsers });
        }
    })
});

//PROFILE SHOW
router.get("/:id", function (req, res) {
    User.findById(req.params.id, function (err, foundUser) {
        console.log(foundUser)
        if (err) {
            console.log(err)
        } else {
            if (foundUser === null) {
                res.redirect("back")
            } else {
            res.render("profiles/show", { user: foundUser });
            }
        }
    });
});


//EDIT Route
router.get("/:id/edit", middleware.isLoggedIn, function (req, res) {
    res.render("profiles/edit")
});

//update route
router.put("/:id", function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body.user, { new: true }, function (err, updatedUser) {
        if (err) {
            res.redirect("/animals");
        } else {
            res.redirect("/profiles/" + req.params.id);
        }
    });
});

//Destroy route
router.delete("/:id", function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/animals");
        } else {
            req.flash("success", "Profile successfully deleted.");
            res.redirect("/profiles");
        }
    })
});

module.exports = router;