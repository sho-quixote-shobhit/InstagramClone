const express = require('express')
const app = express();
const dotenv = require('dotenv')
const port = 5000 || process.env.port
const cors = require('cors')

const morgan = require('morgan')
dotenv.config();
const ConnectToMongo = require('./db')
ConnectToMongo();

app.use(express.json())
app.use(morgan('dev'))
app.use(cors({ origin: "http://localhost:3000", credentials: true }))

const authRoute = require('./routes/auth')
app.use('/auth' , authRoute)
const postRoute = require('./routes/post')
app.use('/posts' , postRoute)
const userRoutes = require('./routes/user')
app.use('/user', userRoutes)



app.listen(port , ()=>{
    console.log(`server running at port ${port}`)
})