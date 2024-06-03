const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");
const cookieParser = require('cookie-parser');

const Authenticate = async (req,res,next)=>{
    //app.use(cookieParser());
    try{
        console.log("kkkkk");
        const token = req.cookies.jwtoken;
        console.log(req.session.cookies);
        const verifyToken = jwt.verify(token, process.env.SECRETKEY);

        const rootUser = await User.findOne({_id:verifyToken._id, "tokens.token":token});

        if(!rootUser){throw new Error("user not found")}

        req.token = token ;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();
    } catch(err){
        res.status(401).json('Unauthorized:No token provided');
        console.log(err);
    }
}

module.exports = Authenticate ;