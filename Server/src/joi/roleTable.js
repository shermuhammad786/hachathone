import Joi from "joi";

export const roleTableSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().min(4).max(200).required(),
    permission: Joi.string().min(4).max(150).required(),
});