require("dotenv").config();
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.js");

async function refreshAccessToken(req, res)
{
    try
    {
        /*
            Fetch refresh token from cookie
            Check if refresh token is empty
            Get decoded payload using jwt verify and refresh token secret
            Find user in database using id in decoded payload
            Generate new access and refresh tokens
            Store new refresh token in DB
            Send new access token, id and role in response
            Set new refresh token as cookie and a dummy cookie that tracks the expiry of the access token
        */

        const refreshToken = req?.cookies?.refreshToken;

        if(!refreshToken)
        {
            return res.status(401).json({
                success: false,
                message: "Unauthorized request."
            });
        }

        const decodedPayload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const userDocument = await userModel.findOne({_id: decodedPayload._id});

        if(!userDocument)
        {
            return res.status(401).clearCookie("refreshToken").json({
                success: false,
                message: "Invalid refresh token."
            });
        }

        const payload = {
            _id: userDocument._id,
            role: userDocument.role
        };

        const newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRY});
        const newRefreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRY});

        await userModel.findOneAndUpdate({_id: userDocument._id}, {$set: {refreshToken: newRefreshToken}});

        res.status(200).
        cookie("refreshToken", newRefreshToken, {
            secure: true,
            httpOnly: true,
            expires: new Date(Date.now() + eval(process.env.REFRESH_TOKEN_EXPIRY_MS))
        })
        .json({
            success: true,
            user: {
                id: userDocument._id,
                name: userDocument.name, 
                role: userDocument.role, 
                accessToken: newAccessToken, 
                courses: userDocument.courses,
                lectures: userDocument.lectures,
                quizzes: userDocument.quizzes,
                discussions: userDocument.discussions,
                comments: userDocument.comments
            },
            message: "Tokens have been refreshed."
        });
    }
    catch(error)
    {
        if(error.message === "jwt expired")
        {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
        else
        {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = refreshAccessToken;