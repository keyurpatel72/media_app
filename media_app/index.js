const express = require('express');
const morgon = require('morgan');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

//routes require
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
require ('./modules/db');

const app = express();


//midleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/user",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/post",postRoute);

app.listen(8000,()=>{
    console.log('Backend server running on port 8000')
})