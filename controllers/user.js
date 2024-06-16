const User = require("../models/user.js");

module.exports.renderSignUp = (req,res)=>{
    res.render("./user/signup.ejs");
}

module.exports.signup = async (req,res,next)=>{
    try{
        let {username,email,password} = req.body;
        let newUser = new User({email,username});
        let registerdUser = await User.register(newUser,password);
        console.log(registerdUser);
        req.login(registerdUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success","Welcome to wanderLust");
            res.redirect("/listings");
        })
       
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLogin = (req,res)=>{
    res.render("./user/login.ejs");
}

module.exports.login = async (req,res)=>{
    req.flash("success","Wecome back to wanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
}