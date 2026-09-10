# -SECURE-CHAT-APP

secure-chat/
│
├── backend/
│   │
│   ├── src/
│   │   │
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   ├── cloudinary.js
│   │   │   └── socket.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── chatController.js
│   │   │   ├── messageController.js
│   │   │   └── uploadController.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Conversation.js
│   │   │   ├── Message.js
│   │   │   └── File.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── chatRoutes.js
│   │   │   ├── messageRoutes.js
│   │   │   └── uploadRoutes.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── uploadMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   └── rateLimitMiddleware.js
│   │   │
│   │   ├── sockets/
│   │   │   ├── chatSocket.js
│   │   │   ├── callSocket.js
│   │   │   └── presenceSocket.js
│   │   │
│   │   ├── services/
│   │   │   ├── messageService.js
│   │   │   ├── encryptionService.js
│   │   │   ├── uploadService.js
│   │   │   └── notificationService.js
│   │   │
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   ├── encryption.js
│   │   │   └── response.js
│   │   │
│   │   └── validators/
│   │       ├── authValidator.js
│   │       ├── messageValidator.js
│   │       └── userValidator.js
│   │
│   ├── uploads/
│   │
│   ├── .env
│   ├── .gitignore
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── hooks/
    │   ├── services/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    │
    ├── public/
    ├── package.json
    └── vite.config.js