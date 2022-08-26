if(process.env.NODE_ENV !== "production")
{
    require('dotenv').config()
}

const express = require('express');
const session = require("express-session")
const ejsMate = require('ejs-mate')
const methodoverride = require('method-override')
const flash = require("connect-flash")
const path = require('path')
const mongoose = require('mongoose');
const expressError = require('./utils/express_error')
const User=require('./models/user')
const mongoSentize=require("express-mongo-sanitize")
const  helmet =require("helmet")
const passport=require('passport');
const passportLocal=require('passport-local');
const userRoutes=require('./routes/user')
const campgroundsRoutes=require('./routes/campground')
const reviewsRoutes=require('./routes/review');
const MongoStore = require('connect-mongo');

const app = express();

//Connection To Mongoose
const localDb="mongodb://localhost:27017/yelp-camp"
const atlasDb=process.env.DB_URL

mongoose.connect(localDb)
    .then(() => {
        console.log('Database Connection Succsessful');
    }).catch((e) => {
        console.log("Error Occured WHile Making Connection To Database");
        console.log('\n' + e);
    })

const secret=process.env.SECRET||"key"

//Setting Some Parameters
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const store1=  MongoStore.create({
    mongoUrl:localDb,
    secret,
    touchAfter:24*60*60
})

store1.on("error",(e)=>{
    console.log("SESSIONSTORE ERROR",e)
})

//Session Settings
const sessionConfig={
    store:store1,
    name:'session',
    secret,
    resave:false,
    saveUninitialized:true ,
    cookie:{
        httpOnly:true,
        // secure:true
        expire:Date.now()+(1000*60*60*24*7),
        maxAge:1000*60*60*24*7,

    }
}


                            //Some MiddleWears

//Encoding URL
app.use(express.urlencoded({ extended: true }))

//Adding Put,Patch,Delete using methodoverride
app.use(methodoverride('method'))

//Serving Static Files
app.use(express.static(path.join(__dirname, 'public')))

//mongo Sentize
app.use(mongoSentize())


//Setting  SessionConfig
app.use(session(sessionConfig));

//Flash
//adding flash to request object
app.use(flash())

        //Passport
app.use(passport.initialize());
app.use(passport.session())


//Adding Authntication Method
passport.use(new passportLocal(User.authenticate()))

//serializing deals with  how to store user in the session
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



//Adding Objects to every response object
app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    next();
})



//Route Campgrounds
app.use('/campgrounds',campgroundsRoutes)

//Route For Users
app.use('/',userRoutes)

//Route for Reviews
app.use('/campgrounds/:id/review',reviewsRoutes)


app.get('/',( req,res)=>{
    res.render('home')
})

//None Defined Routes
app.all("*", (res, req, next) => {
    next(new expressError("Page Not Found", 404))
})

//Error Handlers
app.use((err, req, res, next) => {
    let { statusCode = 500 } = err
    if (!err.message) err.message = "Some Thing Went Wrong";
    res.status(statusCode).render('campgrounds/error', { err })
})

port=process.env.PORT||3000

app.listen(port,() => {
    console.log(`http://localhost:${port}`);
})
