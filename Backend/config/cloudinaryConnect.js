require("dotenv").config();
const cloudinary = require("cloudinary");

function cloudinaryConnect()
{
    try
    {
        cloudinary.v2.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET
        });

        console.log("Successfully connected with cloudinary...");
    }
    catch(error)
    {
        console.log(error.message);
        console.log("Failed to connect with cloudinary...");

        process.exit(1);
    }
}

module.exports = cloudinaryConnect;