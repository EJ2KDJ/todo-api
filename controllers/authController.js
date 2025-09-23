const {User} = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// User login
const login = async (req, res) => {
    try {
        const { name, email, password } = req.body; //Get login details from request body
        const user = await User.findOne({ where: { email } }); //Find user by email
        if (!user) { //If user not found, return error
            return res.status(404).json({ error: 'User not found' });
        }

        if (username) {
            if (
                username === process.env.ADMIN_USERNAME &&
                password === process.env.ADMIN_PASSWORD
            ) {
                const token = jwt.sign(
                    { username, role: "admin" },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRES_IN }
                );
                return res.json({ message: "Admin login successful", token });
            }
            return res.status(401).json({ error: "Invalid admin credentials" });
        }

        //Check Password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) { //If password is invalid, return error
            return res.status(401).json({ error: 'Invalid password' });
        }

        //Generate JWT token upon successful login
        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({ token });
        return res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to login' });   
    }
}

module.exports = login;