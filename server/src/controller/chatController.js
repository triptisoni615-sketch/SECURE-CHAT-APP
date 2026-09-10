import Conversation from "../model/conversation_model.js";
import User from "../model/user_model.js";


// =====================================
// CREATE PRIVATE CHAT
// =====================================

export const createPrivateChat = async (
    req,
    res,
    next
) => {

    try {

        const {
            userId
        } = req.body;


        if (!userId) {

            return res.status(400).json({
                success: false,
                message: "userId is required"
            });

        }


        if (userId === req.user.userId) {

            return res.status(400).json({
                success: false,
                message: "You cannot chat with yourself"
            });

        }


        const otherUser =
            await User.findById(userId);


        if (!otherUser) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }


        let conversation =
            await Conversation.findOne({

                type: "private",

                participants: {
                    $all: [
                        req.user.userId,
                        userId
                    ]
                }

            });


        if (!conversation) {

            conversation =
                await Conversation.create({

                    participants: [
                        req.user.userId,
                        userId
                    ],

                    type: "private"

                });

        }


        await conversation.populate(
            "participants",
            "first_name last_name email profile_img is_online last_seen"
        );


        res.status(200).json({

            success: true,

            conversation

        });

    } catch (error) {

        next(error);

    }

};


// =====================================
// GET MY CHATS
// =====================================

export const getMyChats = async (
    req,
    res,
    next
) => {

    try {

        const conversations =
            await Conversation.find({

                participants: req.user.userId

            })
            .populate(
                "participants",
                "first_name last_name email profile_img is_online last_seen"
            )
            .populate(
                "last_message"
            )
            .sort({
                updatedAt: -1
            });


        res.status(200).json({

            success: true,

            conversations

        });

    } catch (error) {

        next(error);

    }

};


// =====================================
// GET CHAT
// =====================================

export const getChatById = async (
    req,
    res,
    next
) => {

    try {

        const conversation =
            await Conversation.findOne({

                _id: req.params.id,

                participants: req.user.userId

            })
            .populate(
                "participants",
                "first_name last_name email profile_img is_online last_seen"
            );


        if (!conversation) {

            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });

        }


        res.status(200).json({

            success: true,

            conversation

        });

    } catch (error) {

        next(error);

    }

};