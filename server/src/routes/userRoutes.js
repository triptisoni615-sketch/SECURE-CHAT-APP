import express from "express";

import {
    getMyProfile,
    updateProfile,
    searchUsers,
    getUserById
} from "../controller/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// My profile
router.get(
    "/me",
    authMiddleware,
    getMyProfile
);


// Update profile
router.put(
    "/profile",
    authMiddleware,
    updateProfile
);


// Search users
router.get(
    "/search",
    authMiddleware,
    searchUsers
);


// Get user
router.get(
    "/:id",
    authMiddleware,
    getUserById
);


export default router;