import express from "express";

import {
    createPrivateChat,
    getMyChats,
    getChatById
} from "../controller/chatController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// Create private chat
router.post(
    "/private",
    authMiddleware,
    createPrivateChat
);


// Get all chats
router.get(
    "/abc",
    authMiddleware,
    getMyChats
);


// Get one chat
router.get(
    "/:id",
    authMiddleware,
    getChatById
);


export default router;