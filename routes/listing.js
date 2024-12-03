const express=require("express");
const router =express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js")
const {isLoggedIn,isOwner,validateListing}= require("../middleware.js");
const multer=require('multer');
const {storage}=require("../cloudConfig.js")
const upload=multer({storage}); 

const listingController=require("../controllers/listing.js");

//index route
router.get("/",wrapAsync(listingController.index))


//New route
router.get("/new",isLoggedIn,listingController.renderNewForm)

//create route
router.post("/",isLoggedIn,upload.single("image"),validateListing,wrapAsync(listingController.createListing))

//show route
router.get("/:id",wrapAsync(listingController.showListing));


//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))


//update route
router.put("/:id",isLoggedIn,isOwner,upload.single("image"),validateListing,wrapAsync(listingController.updateListing))


//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

//book route
router.get("/:id/book",isLoggedIn,wrapAsync(listingController.bookListing));

//book post route
router.post("/:id/book",isLoggedIn,wrapAsync(listingController.finalBooking));
module.exports=router;