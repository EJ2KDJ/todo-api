const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const {authMiddleware} = require('../middleware');

// All task routes require authentication
router.use(authMiddleware);

router.post("/", taskController.createTask);        // Create task for authenticated user
router.get("/", taskController.getUserTasks);       // Get tasks for authenticated user
router.put("/:id", taskController.updateTask);      // Update a specific task (ownership verified)
router.delete("/:id", taskController.deleteTask);   // Delete a specific task (ownership verified)

module.exports = router;