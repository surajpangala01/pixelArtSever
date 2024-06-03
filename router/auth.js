const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require("../middleware/authenticate");

require('../db/conn');
const User = require('../model/userSchema');

router.get('/',(req,res)=>{
    res.send(`hello world from server router js`);
})

// Register route:
// USING ASYNC-AWAIT :
router.post('/register',async (req,res)=>{
    const {name,email,phone,work,password,cpassword} = req.body;

    if(!name||!email||!phone||!work||!password||!cpassword){
        return res.status(422).json({error:"plz fill form properly"});
        // 422 : the request was well-formed but was unable to be followed due to semantic errors.
    }

    try{
        const userExist = await User.findOne({email:email});
        // left=database ka email , right=entered email
        
        if(userExist){
            return res.status(422).json({error:"email already exist"});
        }
        else if(password != cpassword){
            return res.status(422).json({error:"passwords not maching"});
        }

        const user = new User({name,email,phone,work,password,cpassword});

    // hashing password takes place here before save - look into userSchema.js file
        const userRegister = await user.save() ;

        // console.log(`${user} user registered successfull`);
        // console.log(userRegister);

        if(userRegister){
            res.status(201).json({message:"user successfully registered"});
        }
        else{
            res.status(500).json({error:"failed to registered"})
        }
    } 
    catch(err){
        console.log(err);
    }

    //console.log(name); 
    // res.json({message:req.body});
    // res.send("mera register page");

});


// USING PROMISES :
// router.post('/register',(req,res)=>{
//     const {name,email,phone,work,password,cpassword} = req.body;

//     if(!name||!email||!phone||!work||!password||!cpassword){
//         return res.status(422).json({error:"plz fill form properly"});
//         // 422 : the request was well-formed but was unable to be followed due to semantic errors.
//     }

//     // left=database ka email , right=entered email
//     User.findOne({email:email})
//     .then((userExist)=>{
//         if(userExist){
//             return res.status(422).json({error:"email already exist"});
//         }

//         const user = new User({name,email,phone,work,password,cpassword});

//         user.save()
//         .then(() => {res.status(201).json({message:"successfully registered"});})
//         .catch((err) => res.status(500).json({error:"failed to registered"}));

//     }).catch(err => {console.log(err)});

//     //console.log(name); 
//     // res.json({message:req.body});
//     // res.send("mera register page");

// });

// login route :
router.post('/signin',async (req,res) => {
    // console.log(req.body);
    // res.json({message:"awesome"});
    try{
        const {email,password} = req.body ;
        if(!email || !password){
            return res.status(400).json({error:"pls fill properly"});
        }

        const userLogin = await User.findOne({email:email});
        //console.log(userLogin);
        if(userLogin){
            const isMatch = await bcrypt.compare(password,userLogin.password);

            const token = await userLogin.generateAuthToken(); //generating token in userSchema.js file, it is user defined function
            console.log(token);

            res.cookie("jwtoken",token,{
                expires:new Date(Date.now() + 25892000000),
                httpOnly:true
            });

            if(!isMatch){
                res.status(400).json({error:"invalid credentials"})
            }
            else{
                res.status(200).json({message:"user sign in successfully"});
            }
        }
        else{
            res.status(400).json({message:"invalid credentials"});
        }
    }
    catch(err){
        console.log(err);
    }
})

router.get("/about",(req,res) => {
    console.log("authhh");
    // res.send(req.rootUser);
});

router.get("/signin/:email",(req,res)=>
{
    const email = req.params.email;
    User.findOne({"email":email})
    .then((data)=>
    {
        console.log(data)
        res.json(data)
    })
})

router.get('/getdata',authenticate,(req,res)=>{
    console.log("authhh");
    res.send(req.rootUser);
});

module.exports = router ;