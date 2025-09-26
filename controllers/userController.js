const { User, Task } = require('../sequelize/models');
const bcrypt = require('bcrypt');

//Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll(); //Fetch all users from the database
        res.status(200).json(users);
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
        const { name, email, password } = req.body; //Get user details from request body


        if (!name || !email || !password) {
            return res.status(400).json({ 
                error: "Name, email, and password are required" 
            });
        }

        if (typeof password !== "string") {
            return res.status(400).json({ error: "Password must be a string" });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }

        console.log("Signup body: ", req.body);
        const hashedPassword = await bcrypt.hash(password, 10); //Hash the password before storing
        const newUser = await User.create({ name, email, password: hashedPassword }); //Create new user in the database

        return res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to create user' });
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.user.id; //Get authenticated user
        const { name, email, password } = req.body; //Get updated user details from request body
        const user = await User.findByPk(userId); //Find user by primary key
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already in use' });
            }
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
        await Task.destroy({ where: { userId } }); //Delete all tasks associated with the user
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.destroy(); //Delete the user
        res.status(201).json({ message: 'User deleted successfully' });
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