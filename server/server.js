const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser())
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'})
require('./db/conn');

const PORT = process.env.PORT;
app.use('/',require('./routes/auth'))
app.listen(PORT,()=>{
    console.log("Server started on port 5000");
})