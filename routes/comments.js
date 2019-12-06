const express = require("express"),
    router = express.Router({mergeParams: true}),
    Animal = require("../models/animal"),
    Comment = require("../models/comment"),
    middleware = require("../middleware")

//Comments New
router.get("/new", middleware.isLoggedIn, function (req, res) {
    Animal.findById(req.params.id, function (err, animal) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {animal: animal });
        }
    });
});

//Comments Create
router.post("/", middleware.isLoggedIn, function (req, res) {
    Animal.findById(req.params.id, function (err, animal) {
        if (err) {
            console.log(err);
            res.redirect("/animals");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    req.flash("error", "Something went wrong!");
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    animal.comments.push(comment);
                    animal.save();
                    req.flash("success", "Comment successfully added.")
                    res.redirect("/animals/" + animal._id);
                }
            });
        }
    });
});

// EDIT 
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", { animal_id: req.params.id, comment: foundComment });
        }
    });
});

// UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/animals/" + req.params.id);
        }
    });
});

// DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted.");
            res.redirect("/animals/" + req.params.id);
        }
    });
});


module.exports = router;