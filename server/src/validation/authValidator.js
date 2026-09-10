import Joi from "joi";

export const registerValidator = Joi.object({

    first_name: Joi.string()
        .min(2)
        .max(50)
        .required(),

    last_name: Joi.string()
        .max(50)
        .allow(""),

    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .min(6)
        .required()

});


export const loginValidator = Joi.object({

    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .required()

});