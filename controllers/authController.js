const {User} = require("../sequelize/models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// User login
const login = async (req, res) => {
    try {
        const { name, email, password } = req.body; //Get login details from request body      

        if (name && name === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
            const token = jwt.sign(
                { role: "admin", name },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );
            return res.json({ message: "Admin login successful", token });
        }

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await User.findOne({ where: { email } }); //Find user by email
        if (!user) { //If user not found, return error
            return res.status(404).json({ error: 'User not found' });
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

        return res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to login' });   
    }
}

module.exports = login;