if(process.env.NODE_ENV!="production");
require("dotenv").config();
console.log(process.env.SECRET);

const express=require('express');
const mongoose=require('mongoose');
const app=express();
// const MONG_URL="mongodb://127.0.0.1:27017/wanderMove";
const dbURL=process.env.ATLASDB_URL;
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");

const listingRouter=require('./routes/listing.js')
const reviewRouter=require('./routes/review.js')
const userRoutes = require('./routes/user.js')

const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js")


main().then((res)=>{
    console.log("connecting to db");
})
.catch((err)=>{
    console.log(err);
})


async function main() {
    try {
        await mongoose.connect(dbURL);
        console.log("Connecting to DB");
    } catch (err) {
        console.error("Database connection error:", err);
    }
}


app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate)            //ejs mate
app.use(express.static(path.join(__dirname,"/public")));


const store=MongoStore.create({
    mongoUrl:dbURL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})
store.on("error",()=>{
    console.log("error in mongo session store",err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });
//     let registerdUser=await User.register(fakeUser,"helloworld");
//     res.send(registerdUser);
// })

app.use("/listing",listingRouter);
app.use("/listing/:id/reviews",reviewRouter);
app.use("/",userRoutes);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})

//middleware for error handling
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{err});
    // res.status(statusCode).send(message);
})



app.listen(8080,()=>{
    console.log("app is listening");
})





// app.get("/testListing",async(req,res)=>{
//     let sampleList=new Listing({
//           title:"My New Villa",
//           description:"By the beach",
//           price:1200,
//           location:"calangute, Goa",
//           country:"India",
//     })

//     await sampleList.save();
//     console.log("sample was saved")
//     res.send("testing is successful")

// })