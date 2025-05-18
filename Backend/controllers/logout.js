const userModel = require("../models/user.js");

async function logout(req, res)
{
    try
    {
        /*
            Fetch access token from req.cookies
            Get decoded payload using jwt.verify()
            Check if user exits using id from decoded payload

            Note -> The above steps are implemented using verifyJWT() middleware

            Clear refresh token from database
            Clear access and refresh tokens from cookies
            Send response
        */

        const user = req.user;

        await userModel.findOneAndUpdate({_id: user._id}, {$set: {refreshToken: null}});

        res.status(200).clearCookie("refreshToken").json({
            success: true,
            message: "User logged out successfully."
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

module.exports = logout;