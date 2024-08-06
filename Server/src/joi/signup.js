import Joi from "joi";

export const signUpSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    userName: Joi.string().min(1).max(50).required(),
    name: Joi.string().min(1).max(50).required(),
    otpKey: Joi.string().length(4).required(),
});
export const emailValidate = Joi.object({
    email: Joi.string().email().required()
});

