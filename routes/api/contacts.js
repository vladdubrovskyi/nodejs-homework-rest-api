const express = require("express");
const contactsDataBase = require("../../models/contacts");

const router = express.Router();

router.get("/", async (_, res) => {
  const contacts = await contactsDataBase.listContacts();
  return res.json(contacts);
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contactsDataBase.getContactById(contactId);

  if (!contact) {
    return next();
  }
  return res.json(contact);
});

router.post("/", async (req, res) => {
  const { name, email, phone } = req.body;
  const newContact = await contactsDataBase.addContact(name, email, phone);
  return res.status(201).json(newContact);
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contactsDataBase.getContactById(contactId);
  if (!contact) {
    return next();
  }
  await contactsDataBase.removeContact(contactId);
  return res.status(200).json(contact);
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contactsDataBase.updateContact(contactId, req.body);
  if (!contact) {
    return next();
  }

  return res.status(200).json(contact);
});

module.exports = router;
