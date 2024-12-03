const Listing = require('../models/listing.js');

module.exports.index=async(req,res)=>{
    let allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}
module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listing")
    }
    const currentDate = new Date();
    const availableDates = (listing.startDate <= currentDate && listing.endDate >= currentDate);
    res.render("listings/show.ejs",{listing,availableDates});
}

module.exports.createListing=async(req,res,next)=>{
    // let result=listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400,result.error)
    // }
    let url=req.file.path;
    let filename=req.file.filename;
   
    let {title,description,image,price,country,location}=req.body
    let newListing= new Listing({
    title:title,
    description:description,
    image:image,
    price:price,
    country:country,
    location:location,
})
newListing.owner=req.user._id;
newListing.image={url, filename};

// Introduction
//  if(!newListing.title){
//         throw new ExpressError(400,"Title is missing");
//     }
//     if(!newListing.description){
//         throw new ExpressError(400,"Description is missing");
//     }
//     if(!newListing.price){
//         throw new ExpressError(400,"Price is missing");
//     }
//     if(!newListing.country){
//         throw new ExpressError(400,"Country is missing");
//     }
//     if(!newListing.location){
//         throw new ExpressError(400,"Location is missing");
//     }

await newListing.save();
req.flash("success","New Listing is Added");
res.redirect("/listing");

}

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested does not exit!");
        req.redirect("/listing");
    }
    let originalImageUrl=listing.image.url;
     originalImageUrl=originalImageUrl.replace("/upload","/upload/h_150,w_200")
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    let {title,description,image,price,country,location}=req.body;
    let listing=await Listing.findByIdAndUpdate(id,{title,description,image,price,country,location});
    let url=req.file.path;
    if(typeof req.file!=="undefined"){
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();

    }
    req.flash("success","Listing Updated")
    res.redirect(`/listing/${id}`)
}

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted")
    res.redirect("/listing")
}
module.exports.bookListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested does not exit!");
        req.redirect("/listing");
    }
  
    res.render("listings/booking.ejs",{listing});
}

module.exports.finalBooking = async (req, res) => {
    try {
        const { id } = req.params; // Assuming the listing ID is passed as a URL parameter
        // Fetch the listing from the database using the provided ID
        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect('/listings');
        }

        // Proceed with booking logic (you can add more details about the booking if needed)

        req.flash("success", "Congratulations! Your booking is confirmed.");
        res.redirect(`/listing/${id}`);
    } catch (err) {
        req.flash("error", "Something went wrong. Please try again.");
        res.redirect('/listings');
    }
};
