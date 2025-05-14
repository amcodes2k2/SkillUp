require("dotenv").config();
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.js");

async function verifyJWT(req, res, next)
{
    try
    {
        /*
            Fetch access token from req.cookies
            Get decoded payload using jwt.verify()
            Check if user exits using id from decoded payload
            If user exists, pass the user document to the next function in the req, res cycle
        */

        const accessToken = req.headers['authorization']?.split(" ").at(-1);

        if(!accessToken)
        {
            return res.status(401).json({
                success: false,
                message: "Unauthorized request."
            });
        }

        const decodedPayload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        const userDocument = await userModel.findOne({_id: decodedPayload._id});

        if(!userDocument)
        {
            return res.status(401).json({
                success: false,
                message: "Invalid access token."
            });
        }

        req.user = userDocument;

        next();
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

module.exports = verifyJWT;