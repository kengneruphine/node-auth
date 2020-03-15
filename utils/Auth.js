const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { SECRET } = require('../config');

/**
 * @DESC To register the user (ADMIN, SUPER_ADMIN, USER)
 */

const userRegister = async (userDets, role, res) => {
    try {
        //validate username
        let usernameTaken = await validateUsername(userDets.username);
        if (usernameTaken) {
            return res.status(400).json({
                message: `Username is already taken.`,
                success: false
            });
        }

        //validate email
        let emailRegistered = await validateEmail(userDets.email);
        if (emailRegistered) {
            return res.status(400).json({
                message: `Email is already registered`,
                success: false
            });
        }

        //hash the password
        const password = await bcrypt.hash(userDets.password, 12);

        //create a user
        const newUser = new User({
            ...userDets,
            password,
            role  // passing the role with ES6
        });
    await newUser.save();
        return res.status(201).json({
            message: "Hurry! now you are successfully register, Please now login",
            success: true
        })
    } catch (err) {
        return res.status(500).json({
            message: "Unable to create your account",
            success: false
        })
    }
}


/**
 * @DESC To Login the user (ADMIN, SUPER_ADMIN, USER)
 */

const userLogin = async (userCreds, role, res) => {
    let { username, password } = userCreds;
    //First check if the username is in the database
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({
            message: "Username is not found. Invalid login credentials",
            success: false
        });
    }

    //we will check the role
    if (user.role != role) {
        return res.status(403).json({
            message: "Please make sure you are logging in from the right portal.",
            success: false
        });
    }

    //Now that the user exist and is logging from the right portal,
    //We have to check for the password
    let isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        // sign in the token and issue it to the user
        let token = jwt.sign({
            user_id: user._id,
            role: user.role,
            username: user.username,
            email: user.email
        },
            SECRET, { expiresIn: "7 days" }
        );

        let result = {
            username: user.username,
            role: user.role,
            email: user.email,
            token: `Bearer ${token}`,
            expiresIn: 168
        };

        return res.status(200).json({
            ...result,
            message: "Hurray! You are now logged in",
            success : true
        })
    } else {
        return res.status(403).json({
            message: "Incorrect password",
            success: false
        });
    }
}
const validateUsername = async username => {
    let user = await User.findOne({ username });
    return user ? true : false; //return true if user is present and false otherwise
};

const validateEmail = async email => {
    let user = await User.findOne({ email });
    return user ? true : false;
}

module.exports = {
    userLogin,
    userRegister
};