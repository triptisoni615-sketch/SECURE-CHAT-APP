import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {

        conversation_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true
        },

        sender_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        receiver_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        // Plain content for current MVP.
        // Later E2EE will use encrypted_content.
        content: {
            type: String,
            default: ""
        },

        encrypted_content: {
            type: String,
            default: ""
        },

        encryption_version: {
            type: String,
            default: null
        },

        message_type: {
            type: String,
            enum: [
                "text",
                "image",
                "video",
                "pdf",
                "file"
            ],
            default: "text"
        },

        file_url: {
            type: String,
            default: ""
        },

        file_name: {
            type: String,
            default: ""
        },

        file_size: {
            type: Number,
            default: 0
        },

        mime_type: {
            type: String,
            default: ""
        },

        is_delivered: {
            type: Boolean,
            default: false
        },

        is_read: {
            type: Boolean,
            default: false
        },

        reply_to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null
        }

    },
    {
        timestamps: true
    }
);

const Message = mongoose.model(
    "Message",
    messageSchema
);

export default Message;