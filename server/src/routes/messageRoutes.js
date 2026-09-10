import express from "express";

import {
    sendMessage,
    getMessages,
    markMessageRead,
    deleteMessage
} from "../controller/messageController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// Send message
router.post(
    "/",
    authMiddleware,
    sendMessage
);


// Get conversation messages
router.get(
    "/conversation/:conversationId",
    authMiddleware,
    getMessages
);


// Mark read
router.put(
    "/:id/read",
    authMiddleware,
    markMessageRead
);


// Delete message
router.delete(
    "/:id",
    authMiddleware,
    deleteMessage
);


export default router;