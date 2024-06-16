const Listing = require("../models/Listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    console.log(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New review created");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async(req,res)=>{
    let {id,review_id}= req.params;
    
    await Listing.findByIdAndUpdate(id,{$pull : {reviews:review_id}});
    await Review.findByIdAndDelete(review_id);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`)
}