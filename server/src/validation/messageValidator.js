import Joi from "joi";

export const messageValidator = Joi.object({

    conversation_id: Joi.string()
        .required(),

    content: Joi.string()
        .allow("")
        .max(10000),

    encrypted_content: Joi.string()
        .allow(""),

    message_type: Joi.string()
        .valid(
            "text",
            "image",
            "video",
            "pdf",
            "file"
        )
        .default("text"),

    file_url: Joi.string()
        .allow(""),

    file_name: Joi.string()
        .allow(""),

    reply_to: Joi.string()
        .allow(null, "")

});