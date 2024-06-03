const dotenv = require("dotenv");
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const mongo = require("mongodb")

dotenv.config({path:'./config.env'});
require('./db/conn');

// app.use(cookieParser());

// app.use(express.json());
app.use(express.json({ limit: 1048576 }));


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

var ObjectId = mongo.ObjectId;

const MongoClient = mongo.MongoClient;

var db;
var db_images;
var db_community;
var db_priv;

const url = process.env.url

MongoClient.connect(url, function (err, database) {
   // console.log("hello")
   if (err)
      console.log("db error", err)
   else {
      db = database.db("test_work")
      db_images = db.collection("images");
      db_community = db.collection("community")
      db_priv = db.collection("private_share")

      console.log('Connected to MongoDB');
      //Start app only after connection is ready
      // app.listen(5000);
   }
})

// const app = express();

// app.use(cors());
// var students = [
//    {name :"Suraj" , Rollno:30},
//    {name : "Preetham", Rollno: 31}
// ]

app.get("/student/:id", function (req, res) {
   console.log("Connected finally");
   //  var k = JSON.stringify(students);
   // }
   // console.log("hello");
   console.log(req.params.id)
   db_images.find({"email":req.params.id}).toArray()
      .then(img => {
         // console.log(img);
         res.json(img)
      })
      .catch(err => { throw err })
   // res.send(name);
   // console.log(students);
   // res.redirect("/");
});

app.post("/student",async (req, res) => {
   req.body.name = "image1";
   // console.log(req.body);
   console.log("(/student)Data recieved")
   // res.send(req.body);
   await db_images.insertOne(req.body, (err, res) => {
      if (err) throw err;
      console.log("Inserted");

   });
   res.send("Success");
});

app.delete("/student/:id", async (req, res) => {
   const id = req.params.id;
   console.log(id)
   await db_images.deleteOne({ _id: new ObjectId(id) })
      .then((data) => {
         console.log(data)
         console.log("deleted")
      })
      .catch(console.log("Error in delete community"))
   res.send("")
})

app.post("/community",async (req, res) => {
   // console.log(req.body)
   var body = req.body
   body.updated = false;
   // console.log(body)
   await db_community.insertOne(body, (req, res) => {
      if (req) throw req;
      console.log("Inserted")
   })
   res.send("updated");
})



app.get("/community", (req, res) => {
   // console.log("hello")
   db_community.find({}).toArray()
      .then((data) => {
         // console.log(data);
         res.json(data);
      })
      .catch((err) => {
         console.log("error : ", err);
      })
})

app.put("/community", async(req, res) => {
   // console.log(req.body);
   await db_community.updateOne({ "_id": new ObjectId(req.body.id) }, { $set: { "updated_image": req.body.uploaded_image, "updated": true } })
   res.send("done")
   console.log("in put")
   console.log(req.body.uploaded_image)
});

app.get("/community/:id", (req, res) => {
   // console.log()
   db_community.findOne({ "_id": new ObjectId(req.params.id) })
      .then((data) => {
         console.log("got it")
         // console.log(data)
         res.json(data)
      })
})

app.delete("/community/:id", (req, res) => {
   const id = req.params.id;
   db_community.deleteOne({ _id: new ObjectId(id) })
      .then((data) => {
         res.send("deleted")
      })
      .catch("Error in delete community")
})


app.listen(PORT , ()=>{
    console.log(`server is running at ${PORT}`)
});
