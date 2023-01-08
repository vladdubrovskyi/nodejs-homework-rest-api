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

module.exports = ContactSchema;
