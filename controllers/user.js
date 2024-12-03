const User=require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.signup=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newUser=new User({email,username});
        let registerdUser=await User.register(newUser,password);
        console.log(registerdUser);
        req.login(registerdUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","User is registered successfully");
            const redirectUrl = req.session.redirectUrl || "/listing";
            delete req.session.redirectUrl; // Clear after use
            res.redirect(redirectUrl);
        })
        
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
   
}
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs")
}
module.exports.login= async(req, res) => {
    req.flash("success", "Welcome! You are logged in");
    const redirectUrl = res.locals.redirectUrl || "/listing"; // Fallback to default
    res.redirect(redirectUrl);
}

module.exports.logout=(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err); // Pass error to Express error handler
        }
        req.flash("success", "You are logged out!");
        res.redirect('/listing'); // Redirect only after logout is complete
    });
}