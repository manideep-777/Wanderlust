const Listing = require("../models/Listing.js");

module.exports.index = async (req, res) => {
    let allListings = await Listing.find();
    res.render("./listings/index.ejs", { allListings });
}

module.exports.renderNewForm = async (req, res) => {
    // console.log(req.user);
    res.render("./listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing is not existed");
        res.redirect("/listings")
    }
    res.render("./listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {

    // let result=listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // }
    let url = req.file.path;
    let filename = req.file.filename;
    let listing = req.body.listing;
    let newlisting = new Listing(listing);
    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };
    await newlisting.save();
    req.flash("success", "New listing created");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing is not existed");
        res.redirect("/listings")
    }
    let  orginalImageUrl = listing.image.url;
    orginalImageUrl = orginalImageUrl.replace("/upload","/upload/w_250");
    console.log( orginalImageUrl );
    res.render("./listings/edit.ejs", { listing, orginalImageUrl });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file != "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save()
    }

    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`)
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}