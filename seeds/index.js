const mongoose = require('mongoose');
//Importing The Data Model
const campground = require('../models/campground');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

filename = __filename.substring(__filename.length - 14)

//Connection To Mongoose
mongoose.connect('mongodb://localhost:27017/yelp-camp',)
    .then(() => {
        console.log(filename + ' :Database Connection Succsessful');
    }).catch((e) => {
        console.log(filename + ' :Error Occured WHile Making Connection To Database');
        console.log('\n' + e);
    })

//functions to get a random element of array
const sample = arr => arr[Math.floor(Math.random() * arr.length)]


//function to clear and insert random data into the database 
const seeddb = async () => {
    //clear the database
    await campground.deleteMany({})
    //insert random data
    for (let i = 1; i <= 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20 + 10);
        const randomCity = cities[random1000];
        const camp = new campground({
            //USER ID
            author: '62b657d4a2e75be097313ae9',
            location: `${randomCity.city},${randomCity.state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Suscipit, autem facere numquam harum a minima quis cupiditate, nam, officiis ut tempore cumque delectus corporis ducimus. Alias eum est blanditiis perspiciatis!',
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    randomCity.longitude,
                    randomCity.latitude
                ]
            },

            image: [
                {
                    url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
                    filename: 'YelpCamp/z444'
                },
                {
                    url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
                    filename: 'YelpCamp/nax0'
                }
            ]
        })
        await camp.save() ? console.log(i) : ''
    }
}

seeddb().then(() => {
    console.log('Done');
    console.log('If you Changed The DataBase Remeber to change the  USER ID ');

    mongoose.connection.close()
})

