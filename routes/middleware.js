const {ValidCampgroundSchema,reviewSchema} = require('../schemas.js')
const campground  = require('../models/campground');
const Review= require('../models/review');
const expressError = require('../utils/express_error')



module.exports.isLoggedIn= function(req,res,next){
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl
        req.flash('error','You Are Not Logged In')
        return res.redirect('/login')
    }
    next()
}

//Validation Also Can Be Done On MongoseSide 
module.exports.validateCampground=(req,res, next)=> {
    const { error } = ValidCampgroundSchema.validate(req.body)
    if (error) {
        const messgae = error.details.map(obj => obj.message).join(",")
        throw new expressError(messgae, 400)
    } else {
        next()
    }
}

//Middleware for Authorization
module.exports.isAuthor=async (req,res,next)=>{
    const foundedCampground=await campground.findById(req.params.id)
        if (!foundedCampground.author.equals(req.user._id)){
        req.flash('error','Not Authorized!')    
        return res.redirect(`/campgrounds/${req.params.id}`)
        }    
        next()
}
//Middleware for Authorization
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, revId } = req.params
    const review = await Review.findById(revId)
        if (!review.author.equals(req.user._id)){
        req.flash('error','Not Authorized!')    
        return res.redirect(`/campgrounds/${id}`)
        }    
        next()
}



// //Review Validaters
module.exports.validateReview=(req, res, next)=>{

    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const messgae = error.details.map(obj => obj.message).join(",")
        throw new expressError(messgae, 400)
    } else {
        next()
    }
}
