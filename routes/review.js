const express = require('express');
const catchAsync = require('../utils/catch_async')
const { validateReview, isLoggedIn, isReviewAuthor } = require('./middleware')
const reviews=require("../controllers/reviews")

//Creating Objects
// with out merge params it wont have access to parametrs  
const router = express.Router({mergeParams:true});


//Adding reviews
router.post("/",isLoggedIn ,validateReview, reviews.createReview);

router.delete('/:revId',isLoggedIn,isReviewAuthor ,catchAsync(reviews.deleteReview))


module.exports = router;