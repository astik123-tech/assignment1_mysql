const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
const cors = require('cors')
require('dotenv').config() 
require('./configuration/mysql');
require('./configuration/key')
const authRoute =  require('./routes/authRoute')
const UserRoute =  require('./routes/userRoute')

const app = express() 
app.use(cors())
app.use(morgan('dev'))

app.use(express.json())
app.use(express.urlencoded({'extended':true})) 

app.use(authRoute)
app.use(UserRoute)

app.get('/',(req, res) => {
    res.send("Express..")
})

app.use(async(req,res,next)=>{

    next(createError.NotFound("the route does not exist"))
})

app.use((err,req,res,next)=>{
    res.status(err.status || 500)
    res.send({
        status:err.status||500,
        message:err.message
    })
})

const port = process.env.port || 3000 


app.listen(port , () => {
    console.log("server is listening on the port "+port);
})

