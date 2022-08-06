//imports
const express = require('express');
const catchAsync = require('../utils/catch_async')
const campgrounds=require('../controllers/campgrounds')
const {isAuthor,validateCampground,isLoggedIn}=require('../routes/middleware')

const {storage}=require('../cloudinary')
const multer =require('multer')
const upload =multer({storage})



const router = express.Router();

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image') ,validateCampground ,catchAsync(campgrounds.createCamp))
    

router.get("/new",isLoggedIn,campgrounds.newForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCamp))
    .put(isLoggedIn, isAuthor, upload.array('image'),validateCampground, catchAsync(campgrounds.editCamp))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCamp))

    
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editForm))

module.exports = router
