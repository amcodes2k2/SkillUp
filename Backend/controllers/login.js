const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.js");

require("dotenv").config();

async function login(req, res)
{
    try
    {
        /*
            Fetch email and password from req body
            Check if any field is empty
            Check if user exists
            Match passwords
            Generate access and refresh tokens
            Store refresh token in DB
            Send access token, id and role in response
            Set refresh token as cookie and a dummy cookie that tracks the expiry of the access token
        */

        let {email, password} = req.body;
        
        email = email.trim();
        password = password.trim();
        if(email === "" || password === "")
        {
            return res.status(400).json({
                success: false,
                message: "All fields must be filled."
            });
        }

        const userDocument = await userModel.findOne({email: email});
        
        if(!userDocument)
        {
            return res.status(404).json({
                success: false,
                message: "Invalid email address."
            }); 
        }

        const isPasswordCorrect = await bcrypt.compare(password, userDocument.password);

        if(!isPasswordCorrect)
        {
            return res.status(401).json({
                success: false,
                message: "Incorrect password."
            });
        }

        if(userDocument.isVerified === false)
        {
            return res.status(403).json({
                success: false,
                user_id: userDocument._id,
                message: "User account is unverified."
            });
        }
        
        const payload = {
            _id: userDocument._id,
            role: userDocument.role
        };

        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRY});
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRY});

        await userModel.findOneAndUpdate({_id: userDocument._id}, {$set: {refreshToken: refreshToken}});

        res.status(200).
        cookie("refreshToken", refreshToken, {
            secure: true,
            httpOnly: true,
            sameSite: "none",
            expires: new Date(Date.now() + eval(process.env.REFRESH_TOKEN_EXPIRY_MS))
        }).
        json({
            success: true,
            user: {
                id: userDocument._id,
                name: userDocument.name, 
                role: userDocument.role, 
                accessToken: accessToken, 
                courses: userDocument.courses,
                lectures: userDocument.lectures,
                quizzes: userDocument.quizzes,
                discussions: userDocument.discussions,
                comments: userDocument.comments,
                replies: userDocument.replies
            },
            message: "User logged in successfully."
        });
    }
    catch(error)
    {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = login;