import Joi from "joi";

export const profileValidator = Joi.object({

    first_name: Joi.string()
        .min(2)
        .max(50),

    last_name: Joi.string()
        .max(50)
        .allow(""),

    profile_img: Joi.string()
        .allow("")

});