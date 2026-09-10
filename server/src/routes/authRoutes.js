import express from "express";

import {
    register,
    login,
    logout
} from "../controller/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// Register
router.post(
    "/register",
    register
);


// Login
router.post(
    "/login",
    login
);


// Logout
router.post(
    "/logout",
    authMiddleware,
    logout
);


export default router;