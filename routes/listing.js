const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const listingControllers = require("../controllers/listing.js");

const { isLoggedIn, isOwner, validateListing, saveRedirectUrl, forLogin } = require("../middleware.js");


router.route("/")
    .get(wrapAsync(listingControllers.index))     // Index Route
    .post(                                        // Create Route
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingControllers.createListing));
    

// New Route
router.get("/new", isLoggedIn, wrapAsync(listingControllers.renderNewForm));

router.route("/:id")
    .get(forLogin, saveRedirectUrl, wrapAsync(listingControllers.showListing))          // Show Route
    .put(                                                                              // Update Route
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingControllers.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingControllers.destroyListing));   // Delete Route

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingControllers.renderEditForm));

module.exports = router;
