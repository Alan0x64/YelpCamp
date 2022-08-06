const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review =require("./review")
//Schema
// const CampgroundSchema=new schema(
// {
//     title:String,
//     price:String,
//     description:String,
//     location:String
// })

//Defining The Data Model Then Exporting The Model
//Data Model With Validation
// module.exports = mongoose.model('campgrounds',
//     new mongoose.Schema
//         (
//             {
//                 title: {
//                     type:String,
//                     required:[true,"Invalid Title"]
//                 },
//                 image: {
//                     type:String,
//                     required:[true,"Invalid Image Source"]
//                 },
//                 price: {
//                     type:Number,
//                     required:[true,"Invalid Price"],
//                     min:0
//                 },
//                 description: {
//                     type:String,
//                     required:[true,"Invalid Desscription"]
//                 },
//                 location:  {
//                     type:String,
//                     required:[true,"Invalid Location"]
//                 }
//             }
//         )
// )


const ImageSchema= new Schema({
    url:String,
    filename:String
})

ImageSchema.virtual("thumbnail").get(function(){
    return this.url.replace('/upload','/upload/w_200');
})

const opts={toJSON:{virtuals:true}};

//Creating A Schema
const CampgroundSchema = Schema
    (
        {
            title: String,
            image: [ImageSchema],
            price: Number,
            description: String,
            geometry:{
                type:{
                    type:String,
                    enum:['Point'],
                    required:true
                },
                coordinates:{
                    type:[Number],
                    required:true
                }
            },
            location: String,
            author:{
                type:Schema.Types.ObjectId,
                ref:'User'
            },
            reviews: [{
                type: Schema.Types.ObjectId,
                ref: "Review"
            }]
        },
        opts
    )


CampgroundSchema.virtual("properties.popUpMarkup").get(function(){
        return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
        <p>${this.description.substring(0,20)}<br><strong>...</strong></p>`
    })
    
//Mongoose Middleweres
CampgroundSchema.post("findOneAndDelete",async( doc )=>{
    if (!doc) return
    await Review.deleteMany({
        _id:{
            $in:doc.reviews
        }
    })
})

//Creating The Data Model Then Exporting The Model
module.exports = mongoose.model('campgrounds', CampgroundSchema)