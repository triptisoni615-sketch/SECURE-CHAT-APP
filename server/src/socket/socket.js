import jwt from "jsonwebtoken";

import Message from "../model/message_model.js";
import Conversation from "../model/conversation_model.js";
import User from "../model/user_model.js";

const initializeSocket = (io) => {


    // =====================================
    // SOCKET AUTHENTICATION
    // =====================================

    io.use((socket, next) => {

        try {

            const token =
                socket.handshake.auth?.token;


            if (!token) {

                return next(
                    new Error("Authentication required")
                );

            }


            const decoded =
                jwt.verify(
                    token,
                    process.env.JWT_SECRET
                );


            socket.userId =
                decoded.userId.toString();


            next();

        } catch (error) {

            next(
                new Error("Invalid socket token")
            );

        }

    });


    // =====================================
    // CONNECTION
    // =====================================

    io.on("connection", async (socket) => {

        console.log(
            "User connected:",
            socket.userId,
            socket.id
        );


        // =================================
        // USER ROOM
        // =================================

        socket.join(
            `user:${socket.userId}`
        );


        // =================================
        // ONLINE
        // =================================

        await User.findByIdAndUpdate(
            socket.userId,
            {
                is_online: true
            }
        );


        io.emit("user_status", {

            userId: socket.userId,

            status: "online"

        });


        // =================================
        // JOIN CHAT
        // =================================

        socket.on(
            "join_conversation",
            async (conversationId) => {

                try {

                    const conversation =
                        await Conversation.findOne({

                            _id: conversationId,

                            participants:
                                socket.userId

                        });


                    if (!conversation) {

                        return;

                    }


                    socket.join(
                        `conversation:${conversationId}`
                    );


                    console.log(
                        `${socket.userId} joined ${conversationId}`
                    );

                } catch (error) {

                    console.error(error);

                }

            }
        );


        // =================================
        // LEAVE CHAT
        // =================================

        socket.on(
            "leave_conversation",
            (conversationId) => {

                socket.leave(
                    `conversation:${conversationId}`
                );

            }
        );


        // =================================
        // SEND MESSAGE
        // =================================

        socket.on(
            "send_message",
            async (data) => {

                try {

                    const {

                        conversationId,

                        content = "",

                        encryptedContent = "",

                        messageType = "text",

                        fileUrl = "",

                        fileName = "",

                        replyTo = null

                    } = data;


                    const conversation =
                        await Conversation.findOne({

                            _id: conversationId,

                            participants:
                                socket.userId

                        });


                    if (!conversation) {

                        socket.emit(
                            "message_error",
                            {
                                message:
                                    "Conversation not found"
                            }
                        );

                        return;

                    }


                    const receiver =
                        conversation.participants.find(
                            id =>
                                id.toString() !==
                                socket.userId
                        );


                    const message =
                        await Message.create({

                            conversation_id:
                                conversationId,

                            sender_id:
                                socket.userId,

                            receiver_id:
                                receiver || null,

                            content,

                            encrypted_content:
                                encryptedContent,

                            encryption_version:
                                encryptedContent
                                    ? "v1"
                                    : null,

                            message_type:
                                messageType,

                            file_url:
                                fileUrl,

                            file_name:
                                fileName,

                            reply_to:
                                replyTo,

                            is_delivered:
                                false,

                            is_read:
                                false

                        });


                    conversation.last_message =
                        message._id;


                    await conversation.save();


                    const populatedMessage =
                        await Message.findById(
                            message._id
                        )
                        .populate(
                            "sender_id",
                            "first_name last_name profile_img"
                        );


                    // Send to everyone in conversation
                    io.to(
                        `conversation:${conversationId}`
                    ).emit(
                        "receive_message",
                        populatedMessage
                    );


                    // Receiver notification
                    if (receiver) {

                        io.to(
                            `user:${receiver.toString()}`
                        ).emit(
                            "new_message",
                            populatedMessage
                        );

                    }

                } catch (error) {

                    console.error(
                        "Socket message error:",
                        error
                    );


                    socket.emit(
                        "message_error",
                        {
                            message:
                                "Message could not be sent"
                        }
                    );

                }

            }
        );


        // =================================
        // TYPING
        // =================================

        socket.on(
            "typing",
            ({ conversationId }) => {

                socket
                    .to(
                        `conversation:${conversationId}`
                    )
                    .emit(
                        "user_typing",
                        {
                            userId:
                                socket.userId
                        }
                    );

            }
        );


        // =================================
        // STOP TYPING
        // =================================

        socket.on(
            "stop_typing",
            ({ conversationId }) => {

                socket
                    .to(
                        `conversation:${conversationId}`
                    )
                    .emit(
                        "user_stop_typing",
                        {
                            userId:
                                socket.userId
                        }
                    );

            }
        );


        // =================================
        // MESSAGE DELIVERED
        // =================================

        socket.on(
            "message_delivered",
            async ({
                messageId,
                conversationId
            }) => {

                try {

                    const message =
                        await Message.findById(
                            messageId
                        );


                    if (!message) {
                        return;
                    }


                    message.is_delivered =
                        true;


                    await message.save();


                    io.to(
                        `conversation:${conversationId}`
                    ).emit(
                        "message_delivered",
                        {
                            messageId
                        }
                    );

                } catch (error) {

                    console.error(error);

                }

            }
        );


        // =================================
        // MESSAGE READ
        // =================================

        socket.on(
            "message_read",
            async ({
                messageId,
                conversationId
            }) => {

                try {

                    const message =
                        await Message.findById(
                            messageId
                        );


                    if (!message) {
                        return;
                    }


                    message.is_delivered =
                        true;

                    message.is_read =
                        true;


                    await message.save();


                    io.to(
                        `conversation:${conversationId}`
                    ).emit(
                        "message_read",
                        {
                            messageId
                        }
                    );

                } catch (error) {

                    console.error(error);

                }

            }
        );


        // =================================
        // VIDEO / AUDIO CALL
        // =================================

        socket.on(
            "call_user",
            ({
                receiverId,
                offer,
                callType
            }) => {

                io.to(
                    `user:${receiverId}`
                ).emit(
                    "incoming_call",
                    {

                        callerId:
                            socket.userId,

                        offer,

                        callType

                    }
                );

            }
        );


        // =================================
        // CALL ACCEPT
        // =================================

        socket.on(
            "call_accepted",
            ({
                callerId,
                answer
            }) => {

                io.to(
                    `user:${callerId}`
                ).emit(
                    "call_accepted",
                    {
                        answer
                    }
                );

            }
        );


        // =================================
        // ICE CANDIDATE
        // =================================

        socket.on(
            "ice_candidate",
            ({
                receiverId,
                candidate
            }) => {

                io.to(
                    `user:${receiverId}`
                ).emit(
                    "ice_candidate",
                    {
                        candidate
                    }
                );

            }
        );


        // =================================
        // REJECT CALL
        // =================================

        socket.on(
            "call_rejected",
            ({
                callerId
            }) => {

                io.to(
                    `user:${callerId}`
                ).emit(
                    "call_rejected"
                );

            }
        );


        // =================================
        // END CALL
        // =================================

        socket.on(
            "end_call",
            ({
                receiverId
            }) => {

                io.to(
                    `user:${receiverId}`
                ).emit(
                    "call_ended"
                );

            }
        );


        // =================================
        // DISCONNECT
        // =================================

        socket.on(
            "disconnect",
            async () => {

                try {

                    await User.findByIdAndUpdate(
                        socket.userId,
                        {

                            is_online: false,

                            last_seen:
                                new Date()

                        }
                    );


                    io.emit(
                        "user_status",
                        {

                            userId:
                                socket.userId,

                            status:
                                "offline",

                            lastSeen:
                                new Date()

                        }
                    );


                    console.log(
                        "User disconnected:",
                        socket.userId
                    );

                } catch (error) {

                    console.error(error);

                }

            }
        );

    });

};

export default initializeSocket;