const User=require('../models/user');

//Sign Up Route
module.exports.signupForm=(req,res)=>{
    res.render('users/register');
}

module.exports.signup=async (req,res,next)=>{
    try {
        const {username,email,password}=req.body;
        const NewUser=await User.register(new User({email,username}),password);
       
        req.login(NewUser,(err)=>{
            if(err) return next(err);
            req.flash('success','Welcome To Yelp Camp');
            res.redirect("/campgrounds");
        });
    } catch (error) {
        req.flash('error',error.message);
        res.redirect("/register");
    }
}

//Log In Route

module.exports.loginForm=(req,res)=>{
    res.render('users/login');
}

module.exports.login=async (req,res)=>
    {
        const redirectUrl= req.session.returnTo || "/campgrounds"; 
        req.flash('success','Welcome Back');
        delete req.session.returnTo;
        res.redirect( redirectUrl);
    }



//Logout Route


module.exports.logout=(req,res)=>{
    req.logout();
    req.flash('success','Logged Out')
    res.redirect("/campgrounds");

}


