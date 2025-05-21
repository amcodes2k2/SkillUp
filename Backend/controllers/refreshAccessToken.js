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
            Find user in database using refresh token
            Get decoded payload using jwt verify and refresh token secret
            Generate new access token
            Send new access token, id and role in response
        */

        const refreshToken = req?.cookies?.refreshToken;

        if(!refreshToken)
        {
            return res.status(401).json({
                success: false,
                message: "Unauthorized request."
            });
        }

        const userDocument = await userModel.findOne({refreshToken: refreshToken});

        if(!userDocument)
        {
            return res.status(401).clearCookie("refreshToken").json({
                success: false,
                message: "Invalid refresh token."
            });
        }

        const decodedPayload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        if(decodedPayload._id.toString() !== userDocument._id.toString())
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

        res.status(200)
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
            message: "Token has been refreshed."
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