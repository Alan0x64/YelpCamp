const campground = require('../models/campground');
const Review = require('../models/review');

//Adding reviews
module.exports.createReview=async (req, res) => {
    const Campground = await campground.findById(req.params.id);
    const review = await new Review(req.body.review).save()
    review.author=req.user._id
    await Campground.reviews.push(review)
    await review.save()
    await Campground.save()
    req.flash('success','Created a New Review!')
    res.redirect(`/campgrounds/${Campground._id}`)
}

module.exports.deleteReview=async (req, res) => {
    const { id, revId } = req.params;
    await campground.findByIdAndUpdate(id, { $pull: { reviews: revId } })
    await Review.findByIdAndDelete(revId)
    req.flash('success','Successful Deleted Review!')
    res.redirect("/campgrounds/" + id)
}
