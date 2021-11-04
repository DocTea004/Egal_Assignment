const authRouter = require("express").Router();
const User = require("../model/User");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken")

//REGISTER
authRouter.post(
    "/register",
    async(req,res)=>{

        const newUser = new User({

            fullname: req.body.fullname,
            email: req.body.email,
            password:CryptoJs.AES.encrypt
            (
                req.body.password, 
                process.env.PASS_SEC
                ).toString()
        });
         confirmPassword: req.body.confirmPassword,

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
                email: req.body.email
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

module.exports = authRouter;
