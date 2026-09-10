import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {

        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        ],

        type: {
            type: String,
            enum: ["private", "group"],
            default: "private"
        },

        group_name: {
            type: String,
            default: ""
        },

        group_image: {
            type: String,
            default: ""
        },

        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        last_message: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null
        }

    },
    {
        timestamps: true
    }
);

const Conversation = mongoose.model(
    "Conversation",
    conversationSchema
);

export default Conversation;