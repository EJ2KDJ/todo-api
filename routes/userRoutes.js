const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {authMiddleware, requireAdmin} = require('../middleware');

// Public route - no authentication required
router.post('/signup', userController.signup);

// Protected routes - require authentication
router.use(authMiddleware);

// User can only update their own profile
router.put("/profile", userController.updateUser); // Remove :id, use authenticated user

// Admin-only routes
router.get("/", requireAdmin, userController.getAllUsers);        // Get all users
router.get("/:id", requireAdmin, userController.getUserById);     // Get user by ID
router.delete("/:id", requireAdmin, userController.deleteUser);   // Delete any user

module.exports = router;