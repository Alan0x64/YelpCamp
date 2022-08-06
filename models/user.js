/* eslint-disable no-unused-vars */
const { default: mongoose } = require('mongoose');
const {Schema} = require('mongoose');
const passportLM=require('passport-local-mongoose');


const UserSchema = new Schema({
    email:{
    type:String,
    required:true ,
    unique:true
}
    
})

UserSchema.plugin(passportLM);

module.exports= mongoose.model('User',UserSchema)