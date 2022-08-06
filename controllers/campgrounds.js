const campground = require('../models/campground');
const{cloudinary}=require("../cloudinary")
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding")

const mapBoxToken= process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding({accessToken:mapBoxToken})





//Dashbord
module.exports.index = async (req, res) => {
    const campgrounds = await campground.find({})
    res.render('campgrounds/index', { campgrounds })

}

//Create
module.exports.newForm = (req, res) => {
    res.render('./campgrounds/new')
}

module.exports.createCamp = async (req, res, next) => {
    const geoData=await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()



    let x = new campground(req.body.campground);
    x.geometry=geoData.body.features[0].geometry;
    x.image = req.files.map(f => ({ url: f.path, filename: f.filename }))
    x.author = req.user._id;
    await x.save()
    req.flash('success', 'Succesfully Made a New Campground!')
    res.redirect('/campgrounds/' + x._id)
}

//View
module.exports.showCamp =
    async (req, res) => {
        const data = await campground.findById(req.params.id).populate({
            /*
            1-populate the reviews in the reviews array on the campground that we are finding
            2-then populate the author for every review 
            3.popluat the author of the  current founded campground
            */
            path: "reviews",
            populate: {
                path: 'author'
            }
        }).populate('author')
        if (!data) {
            req.flash('error', 'Cannot Find That Campground')
            res.redirect('/campgrounds')
        }
        res.render('./campgrounds/show', { data })
    }

//Edit
module.exports.editForm = async (req, res) => {
    let data = await campground.findById(req.params.id);
    if (!data) {
        req.flash('error', 'Cannot Find That Campground')
        return res.redirect('/campgrounds')
    }
    res.render('./campgrounds/edit', { data })
}
module.exports.editCamp = async (req, res) => {
    let x = await campground.findByIdAndUpdate(req.params.id, { ...req.body.campground })
    let imagess = req.files.map(f => ({ url: f.path, filename: f.filename }))
    x.image.push(...imagess)
    await x.save()
    if (req.body.deleteImages) {
        for(let filename of req.body.deleteImages)
        {
            await cloudinary.uploader.destroy(filename)
        }
        await x.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
    }

    req.flash('success', 'Succesfully Updated Campground!')
    res.redirect(`/campgrounds/${req.params.id}`)
}

//delete
module.exports.deleteCamp = async (req, res) => {
    await campground.findByIdAndDelete(req.params.id)
    req.flash('success', 'Successful Deleted Campground!')
    res.redirect('/campgrounds')
}
// module.exports.newForm =
