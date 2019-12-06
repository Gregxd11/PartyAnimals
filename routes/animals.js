const express = require("express"),
    router    = express.Router(),
    Animal    = require ("../models/animal"),
    middleware = require ("../middleware")


//INDEX - show all campgrounds
router.get("/", function (req, res) {
    Animal.find({}, function (err, allAnimals) {
        if (err) {
            console.log(err)
        } else {
            res.render("animals/index", {animals: allAnimals });
        }
    })
});

//CREATE - add new campgrounds to DB
router.post("/", middleware.isLoggedIn, function (req, res) {
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let price = req.body.price;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newAnimal = { name: name, image: image, description: desc, author: author, price: price }
    Animal.create(newAnimal, function (err, newAnimal) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/animals");
        }
    })
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("animals/new")
})

//SHOW - shows more info about one campground
router.get("/:id", function (req, res) {
    Animal.findById(req.params.id).populate("comments").exec(function (err, foundAnimal) {
        if (err) {
            console.log(err)
        } else {
            res.render("animals/show", {animal: foundAnimal });
        }
    });
});

//EDIT
router.get("/:id/edit", middleware.checkAnimalOwnership, function(req, res){
    Animal.findById(req.params.id, function(err, foundAnimal) {
        res.render("animals/edit", {animal: foundAnimal });
    });
});


//UPDATE
router.put("/:id", middleware.checkAnimalOwnership, function(req, res){
    Animal.findByIdAndUpdate(req.params.id, req.body.animal, function(err, updatedAnimal){
        if(err){
            res.redirect("/animals");
        } else {
            res.redirect("/animals/" + req.params.id);
        }
    });
});

//DESTROY
router.delete("/:id", middleware.checkAnimalOwnership, function(req, res){
    Animal.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect("/animals");
        } else {
            req.flash("success", "Post successfully deleted.");
            res.redirect("/animals");
        }
    })
});


module.exports = router;