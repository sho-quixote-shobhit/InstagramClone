const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();

const ConnectToMongo = () => {
    mongoose.connect(process.env.MONGO_URL)
    mongoose.connection.on('connected', ()=>{
        console.log('connected to database')
    })
    mongoose.connection.on('error' , ()=>{
        console.log('connection failed')
    })
}

module.exports = ConnectToMongo