const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {authMiddleware, requireAdmin} = require('../middleware');


// Define routes for user operations
router.post('/signup', userController.signup); //User signup
// User routes
router.put("/:id", authMiddleware, userController.updateUser);

// Admin-only routes
router.delete("/:id", authMiddleware, requireAdmin, userController.deleteUser);
router.get("/", authMiddleware, requireAdmin, userController.getAllUsers);
router.get("/:id", authMiddleware, requireAdmin, userController.getUserById);

module.exports = router;
