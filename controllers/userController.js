const { User, Task } = require('../sequelize/models');
const bcrypt = require('bcrypt');

//Get all users
const getAllUsers = async (req, res) => {
    try {
        const { users } = await User.findAndCountAll(); //Fetch all users from the database
        res.json(users);
        return res.status(200).json({ message: 'Users retrieved successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
}

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id; //Get userId from request parameters
        const user = await User.findByPk(userId); //Find user by primary key
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
        return res.status(200).json({ message: 'User retrieved successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to retrieve user' });
    }
}

const signup = async (req, res) => {
    try {
        const {name, email, password} = req.body; //Get user details from request body

        if (!password || typeof password !== "string") {
            return res.status(400).json({ error: "Password is required and must be a string" });
        }

        console.log("Signup body: ", req.body);
        const hashedPassword = await bcrypt.hash(password, 10); //Hash the password before storing
        const newUser = await User.create({ name, email, password: hashedPassword }); //Create new user in the database

        return res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to create user' });
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id; //Get userId from request parameters
        const { name, email, password } = req.body; //Get updated user details from request body
        const user = await User.findByPk(userId); //Find user by primary key
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        //Update user details
        user.name = name || user.name;
        user.email = email || user.email;
        if (password) {
            user.password = await bcrypt.hash(password, 10); //Hash and update password if provided
        }

        await user.save();
        return res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to update user' });
    }
}

const deleteUser = async (req, res) => { 
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.destroy(); //Delete the user
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    signup,
    updateUser,
    deleteUser
}