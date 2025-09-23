const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

router.post("/:userId", taskController.createTask);     // Create task for a user
router.get("/:userId", taskController.getUserTasks);    // Get tasks for a user
router.put("/:id", taskController.updateTask);          // Update a specific task
router.delete("/:id", taskController.deleteTask);       // Delete a specific task

module.exports = router;