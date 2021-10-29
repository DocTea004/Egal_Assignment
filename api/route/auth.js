const authRouter = require("express").Router();
const User = require("../model/User");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken")

//REGISTER
authRouter.post(
    "/register",
    async(req,res)=>{

        const newUser = new User({

            username: req.body.username,
            email: req.body.email,
            password:CryptoJs.AES.encrypt
            (
                req.body.password, 
                process.env.PASS_SEC
                ).toString()
        });

        try{
            const savedUser = await newUser.save();
            res.status(201).json(savedUser)
        }
        catch(err){
            res.status(500).json(err);
        }
    }
)

//LOGIN

authRouter.post(
    "/login",
    async(req,res)=>{

        try{
            const user = await User.findOne({
                username: req.body.username
            });
            !user && res.status.json(401).json("Wrong credentials.....")

            const hashedPassword = CryptoJs.AES.decrypt(
                user.password, 
                process.env.PASS_SEC
                );
            const Originalpassword = hashedPassword.toString(CryptoJs.enc.Utf8);

            Originalpassword !== req.body.password &&
                res.status(401).json("Wrong Credentials.....");

            const accessToken = jwt.sign({
                id:user._id, 
                isAdmin: user.isAdmin,
            },
                process.env.JWT_SEC,
                {expiresIn: "3d"}
                )

            const {password, ...others} = user._doc;

            res.status(200).json({...others,accessToken});
        }

        catch(err){
            res.status(500).json(err);
        }
    }
)


//Get all Users
authRouter.get(
    "/",
    async(req,res)=>{
        const query = req.query.new;
        try{
            const users = query
            ? await User.find().sort({_id : -1}).limit(5)
            : await User.find()
            await User.find();
            res.status(200).json(users);
        }

        catch(err){
            res.status(500).json(err);
        }
    }
);

module.exports = authRouter;