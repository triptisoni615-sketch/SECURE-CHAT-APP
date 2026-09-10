import Message from "../model/message_model.js";
import Conversation from "../model/conversation_model.js";

export const createMessage = async ({
    conversationId,
    senderId,
    content = "",
    encryptedContent = "",
    messageType = "text",
    fileUrl = "",
    fileName = "",
    replyTo = null
}) => {

    const conversation =
        await Conversation.findOne({

            _id: conversationId,

            participants: senderId

        });


    if (!conversation) {

        throw new Error(
            "Conversation not found"
        );

    }


    const receiver =
        conversation.participants.find(
            id =>
                id.toString() !==
                senderId.toString()
        );


    const message =
        await Message.create({

            conversation_id:
                conversationId,

            sender_id:
                senderId,

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
                replyTo

        });


    conversation.last_message =
        message._id;


    await conversation.save();


    return Message.findById(
        message._id
    ).populate(
        "sender_id",
        "first_name last_name profile_img"
    );

};