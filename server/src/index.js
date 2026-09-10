import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import initializeSocket from "./socket/socket.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

const app = express();

// ==============================
// Database
// ==============================

connectDB();

// ==============================
// Middleware
// ==============================

app.use(helmet());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

// ==============================
// Routes
// ==============================

app.use("/api/auth", authRoutes);

app.use("/api/chats", chatRoutes);

app.use("/api/users", userRoutes);

app.use("/api/messages", messageRoutes);

app.use("/api/uploads", uploadRoutes);

// ==============================
// Test API
// ==============================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Secure Chat Server is running",
    });
});

// ==============================
// HTTP Server
// ==============================

const server = http.createServer(app);

// ==============================
// Socket.IO
// ==============================

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});

// Initialize Socket
initializeSocket(io);

// ==============================
// Start Server
// ==============================

const PORT = process.env.PORT || 7070;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});