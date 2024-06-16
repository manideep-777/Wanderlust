const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");

const reviewControllers = require("../controllers/review.js")


// Review
// Post review route
router.post("/",validateReview,isLoggedIn, wrapAsync(reviewControllers.createReview));

// Delete review route
router.delete("/:review_id",isLoggedIn,isReviewAuthor,wrapAsync(reviewControllers.destroyReview));

module.exports = router;