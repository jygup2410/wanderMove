const Listing=require("./models/listing");
const Review=require("./models/review");
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must Logged in!!");
        return res.redirect("/login")
    }
    next();
}

module.exports.savedRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    if (!req.params || !req.params.id) {
        req.flash("error", "Invalid request: Missing ID");
        return res.redirect("/listing");
    }

    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listing");
    }
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "Permission denied");
        return res.redirect(`/listing/${id}`);
    }
    next();
};

module.exports.validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map(el=>el.message).join(",");
        return next(new ExpressError(404,errMsg));
    }
    else{
        next();
    }      

}
module.exports.validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(404,errMsg)
    }
    else{
        next();
    }
   
}

module.exports.isReviewAuthor = async (req, res, next) => {
    try {
        const { reviewId, id } = req.params;  // Make sure both IDs are passed in the params
        const review = await Review.findById(reviewId);

        if (!review) {
            req.flash("error", "Review not found");
            return res.redirect("/listing");
        }

        if (!review.author.equals(req.user._id)) {
            req.flash("error", "You are not the author of this review");
            return res.redirect(`/listing/${id}`);
        }

        next();  // Continue if review author matches
    } catch (error) {
        req.flash("error", "Something went wrong while checking review ownership");
        return res.redirect("/listing");
    }
};
