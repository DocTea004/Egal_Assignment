const express = require("express");
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const port = process.env.PORT || 5000;
const cors = require("cors");
const authRouter = require("./route/auth");

dotenv.config();
app.use(express.json());

mongoose
.connect(
    process.env.MONGO_URL,
    { 
        useNewUrlParser: true,
        useUnifiedTopology:true
    }
)
.then(()=> console.log("DB Connection Successfull...."))
.catch((err)=>{
    console.log(err);
})

app.get(
    "/",
    (req,res)=>{
        res.send("Test Successfully done.....");
    }
)

app.use(cors());
app.use("/api/auth",authRouter);

app.listen(
    port,
    ()=>{
        console.log("Server started on port ",port);
    }
)
