const {User, Task} = require('../sequelize/models');

// Get all tasks for the authenticated user
const getUserTasks = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await User.findByPk(userId, {
            include: [{ model: Task }]
        });

        if (!user) {
           return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(user.Tasks || []);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
}


//Create a new task for a specific user
const createTask  = async (req, res) => {
    try {
        const userId = req.user.id; //Check userId from request parameters
        const { name, status, details } = req.body; //Get task details from request body
        const user = await User.findByPk(userId); //find user by primary key

        if (!user) { // error handling if user not found
            return res.status(404).json({ error: 'User not found' });
        }

        const newTask = await Task.create({ name, status, details, userId }); //Create new task associated with user
        res.status(201).json(newTask); //Return the newly created task
    } catch(err) {
        res.status(500).json({ error: 'Failed to create task' });
        console.log(err);
    }
}

//Update a specific task for a user
const updateTask = async (req, res) => {
    try {
        const {name, status, details} = req.body; //Get updated task details from request body
        const taskId = req.params.id; //Get taskId from request parameters
        const userId = req.user.id; //Get userId from authenticated user

        const task = await Task.findOne({ where: { id: taskId, userId } }); //Find task by primary key and userId

        if (!task) { // error handling if task not found
            return res.status(404).json({ error: 'Task not found' });
        }

        task.name = name || task.name; //Update task name if provided
        task.status = status || task.status; //Update task status if provided
        task.details = details || task.details; //Update task details if provided

        await task.save(); //Save the updated task
        res.json(task); //Return the updated task
        return res.status(200).json({ message: 'Task updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update task' });
        console.log(err);
    }
}

const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id; //find task by primary key
        const userId = req.user.id; //Get userId from authenticated user

        const task = await Task.findOne({ where: { id: taskId, userId } }); //Find task by primary key and userId

        if (!task) { // error handling if task not found
            return res.status(404).json({ error: 'Task not found' });
        }

        await task.destroy(); //Delete the task
        return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete task' });
        console.log(err);
    }
}

module.exports = {
    getUserTasks,
    createTask,
    updateTask,
    deleteTask
};