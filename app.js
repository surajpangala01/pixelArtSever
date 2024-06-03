const dotenv = require("dotenv");
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');

dotenv.config({path:'./config.env'});
require('./db/conn');

// app.use(cookieParser());

app.use(express.json());

app.use(cors());
// const User = reqiure('./model/userSchema');

// linking router files
app.use(require('./router/auth'));

// const DB = "mongodb://127.0.0.1:27017"
//const DB = "mongodb+srv://Syed_Tanzeel:shazshazshaz@cluster0.j5hupyw.mongodb.net/mernstack?retryWrites=true&w=majority"
// const DB = process.env.DATABASE ;
const PORT = process.env.PORT ;
// mongoose.connect(DB,{
//     // useNewUrlParser: true,
//     // useCreateIndex: true,
//     // useUnifiedTopology: true,
//     // useFindAndModify:false
// }).then(()=>{
//     console.log(`connection successful`);
// }).catch((err)=>console.log(`no connection`));

// Middleware
// const middleware=(req,res,next)=>{
//     console.log(`hello my middleware`);
//     //res.send(`not allowed`)
//     next();
// }
// middleware();

// can comment this
// app.get('/',(req,res)=>{
//     res.send(`<h1>Hello world from the server</h1>`);
// });

// app.get('/about',(req,res)=>{
//     console.log(`about`);
//     res.send(`<h1>Hello world from the about</h1>`);
// });

app.get('/contact',(req,res)=>{
    res.cookie("test",'hello');
    res.send(`<h1>Hello world from the contact</h1>`);
});

// app.get('/signin',(req,res)=>{
//     res.send(`<h1>Hello world from the signin</h1>`);
// });

app.get('/signup',(req,res)=>{
    res.send(`<h1>Hello world from the signup</h1>`);
});

app.listen(PORT , ()=>{
    console.log(`server is running at ${PORT}`)
});
