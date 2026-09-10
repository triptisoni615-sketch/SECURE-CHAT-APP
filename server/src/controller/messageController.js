import Message from "../model/message_model.js";
import Conversation from "../model/conversation_model.js";

import {
    messageValidator
} from "../validation/messageValidator.js";


// =====================================
// SEND MESSAGE
// =====================================

export const sendMessage = async (
    req,
    res,
    next
) => {

    try {

        const {
            error
        } = messageValidator.validate(req.body);


        if (error) {

            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });

        }


        const {
            conversation_id,
            content,
            encrypted_content,
            message_type,
            file_url,
            file_name,
            reply_to
        } = req.body;


        const conversation =
            await Conversation.findOne({

                _id: conversation_id,

                participants: req.user.userId

            });


        if (!conversation) {

            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });

        }


        const receiver =
            conversation.participants.find(
                id =>
                    id.toString() !==
                    req.user.userId
            );


        const message =
            await Message.create({

                conversation_id,

                sender_id: req.user.userId,

                receiver_id: receiver || null,

                content: content || "",

                encrypted_content:
                    encrypted_content || "",

                encryption_version:
                    encrypted_content
                        ? "v1"
                        : null,

                message_type:
                    message_type || "text",

                file_url:
                    file_url || "",

                file_name:
                    file_name || "",

                reply_to:
                    reply_to || null,

                is_delivered: false,

                is_read: false

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


        res.status(201).json({

            success: true,

            message: populatedMessage

        });

    } catch (error) {

        next(error);

    }

};


// =====================================
// GET MESSAGES
// =====================================

export const getMessages = async (
    req,
    res,
    next
) => {

    try {

        const conversation =
            await Conversation.findOne({

                _id: req.params.conversationId,

                participants: req.user.userId

            });


        if (!conversation) {

            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });

        }


        const messages =
            await Message.find({

                conversation_id:
                    req.params.conversationId

            })
            .populate(
                "sender_id",
                "first_name last_name profile_img"
            )
            .sort({
                createdAt: 1
            });


        res.status(200).json({

            success: true,

            messages

        });

    } catch (error) {

        next(error);

    }

};


// =====================================
// MARK AS READ
// =====================================

export const markMessageRead = async (
    req,
    res,
    next
) => {

    try {

        const message =
            await Message.findById(
                req.params.id
            );


        if (!message) {

            return res.status(404).json({
                success: false,
                message: "Message not found"
            });

        }


        const conversation =
            await Conversation.findOne({

                _id: message.conversation_id,

                participants: req.user.userId

            });


        if (!conversation) {

            return res.status(403).json({
                success: false,
                message: "Access denied"
            });

        }


        message.is_delivered = true;

        message.is_read = true;

        await message.save();


        res.status(200).json({

            success: true,

            message: "Message marked as read"

        });

    } catch (error) {

        next(error);

    }

};


// =====================================
// DELETE MESSAGE
// =====================================

export const deleteMessage = async (
    req,
    res,
    next
) => {

    try {

        const message =
            await Message.findOne({

                _id: req.params.id,

                sender_id: req.user.userId

            });


        if (!message) {

            return res.status(404).json({
                success: false,
                message: "Message not found"
            });

        }


        await Message.findByIdAndDelete(
            message._id
        );


        res.status(200).json({

            success: true,

            message: "Message deleted"

        });

    } catch (error) {

        next(error);

    }

};