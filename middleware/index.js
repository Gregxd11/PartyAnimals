const middlewareObj = {},
      Animal        = require("../models/animal"),
      Comment       = require("../models/comment")

middlewareObj.checkAnimalOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Animal.findById(req.params.id, function (err, foundAnimal) {
            if (err) {
                res.flash("error", "Animal not found");
                res.redirect("back");
            } else {
                if (!foundAnimal) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                } else if (foundAnimal.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.flash("error", "You don't have permission to do that.")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You must be logged in to do that")
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                if (!foundComment) {
                  req.flash("error", "Item not found.");
                  return res.redirect("back");
                } else if (foundComment.author.id.equals(req.user._id)) {
                  next();
                } else {
                  req.flash("error", "You don't have permission to do that.");
                  res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You must be logged in to do that.");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You must be logged in to do that.");
    res.redirect("/login");
}





module.exports = middlewareObj;