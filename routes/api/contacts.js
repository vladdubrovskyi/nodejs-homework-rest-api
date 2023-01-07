const express = require("express");
const Joi = require("joi");
const { validateBody } = require("../../middlewares/index");
const { tryCatchWrapper } = require("../../helpers/index");
const {
  getContacts,
  getContact,
  addContact,
  removeContact,
  changeContact,
} = require("../../controllers/controllers");

const ContactSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "any.required": "you should provide title!!",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "you should provide email!!",
  }),
  phone: Joi.string().required().min(6),
});

const router = express.Router();

router.get("/", tryCatchWrapper(getContacts));

router.get("/:contactId", tryCatchWrapper(getContact));

router.post("/", validateBody(ContactSchema), tryCatchWrapper(addContact));

router.delete("/:contactId", tryCatchWrapper(removeContact));

router.put(
  "/:contactId",
  validateBody(ContactSchema),
  tryCatchWrapper(changeContact)
);

module.exports = router;
