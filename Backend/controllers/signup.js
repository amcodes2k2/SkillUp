const bcrypt = require("bcrypt");
const userModel = require("../models/user.js");

async function signup(req, res)
{
    try
    {
        /*
            Fetch role, name, email and password from req body
            Check if any field is empty
            Check if user already exists
            Hash password
            Store user details into DB
            Send response
        */

        let {role, name, email, password} = req.body;

        name = name.trim();
        email = email.trim();
        password = password.trim();
        if(name === "" || email === "" || password === "")
        {
            return res.status(400).json({
                success: false,
                message: "All fields must be filled."
            });
        }

        const doesUserExist = await userModel.findOne({email: email});

        if(doesUserExist)
        {
            return res.status(409).json({
                success: false,
                message: "User already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userDocument = await userModel.create({role: role, name: name, email: email, password: hashedPassword});

        res.status(201).json({
            success: true,
            user_id: userDocument._id,
            message: "Unverified account created successfully."
        });
    }
    catch(error)
    {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = signup;