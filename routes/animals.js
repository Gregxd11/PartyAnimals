const express = require("express"),
    router    = express.Router(),
    Animal    = require ("../models/animal"),
    middleware = require ("../middleware"),
    validator = require("validator")


//INDEX - show all animals
router.get("/", function (req, res) {
    Animal.find({}, function (err, allAnimals) {
        if (err) {
            console.log(err)
        } else {
            res.render("animals/index", {animals: allAnimals });
        }
    })
});

//CREATE - add new animal to DB
router.post("/", middleware.isLoggedIn, function (req, res) {
    let name = req.body.name;
    let desc = req.body.description;
    let price = req.body.price;
    let postType = req.body.postType;
    let author = {
        id: req.user._id,
        username: req.user.username,
        image: req.user.image,
        location: req.user.location
    }
    if(req.body.image === ""){
        var image = undefined
    } else {
        var image = req.body.image
    }
    let newAnimal = 
        { 
            name: name, 
            image: image, 
            description: desc, 
            author: author, 
            price: price, 
            postType: postType 
        }
    Animal.create(newAnimal, function (err, newAnimal) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/animals");
        }
    })
});

//NEW - show form to create new animal
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("animals/new")
})

//SHOW - shows more info about one animal
router.get("/:id", function (req, res) {
    Animal.findById(req.params.id).populate("comments").exec(function (err, foundAnimal) {
        if (validator.isMongoId(req.params.id) && foundAnimal != null) {
            res.render("animals/show", {animal: foundAnimal });
        } else {
            req.flash("error", "Post not found")
            res.redirect("/animals")
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