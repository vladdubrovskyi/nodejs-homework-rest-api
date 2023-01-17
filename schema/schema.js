const Joi = require("joi");

const ContactSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "any.required": "you should provide title!!",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "you should provide email!!",
  }),
  phone: Joi.string().required().min(6),
});

const ContactUpdateSchema = Joi.object({
  name: Joi.string().min(3),
  email: Joi.string().email(),
  phone: Joi.string().min(6),
}).min(1);

const FavoriteStatusSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": `missing favorite field`,
  }),
});

module.exports = {
  ContactSchema: ContactSchema,
  ContactUpdateSchema: ContactUpdateSchema,
  FavoriteStatusSchema: FavoriteStatusSchema,
};
