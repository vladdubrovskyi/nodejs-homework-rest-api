const contactsDataBase = require("../models/contacts");
const { HttpError } = require("../helpers/index");

async function getContacts(_, res) {
  const contacts = await contactsDataBase.listContacts();
  return res.json(contacts);
}

async function getContact(req, res, next) {
  const { contactId } = req.params;
  const contact = await contactsDataBase.getContactById(contactId);
  if (!contact) {
    return next(HttpError(404, "Not found"));
  }
  return res.json(contact);
}

async function addContact(req, res) {
  const { name, email, phone } = req.body;
  const newContact = await contactsDataBase.addContact(name, email, phone);
  return res.status(201).json(newContact);
}

async function removeContact(req, res, next) {
  const { contactId } = req.params;
  const contact = await contactsDataBase.getContactById(contactId);
  if (!contact) {
    return next(HttpError(404, "No contact"));
  }
  await contactsDataBase.removeContact(contactId);
  return res.status(200).json(contact);
}

async function changeContact(req, res, next) {
  const { contactId } = req.params;
  const contact = await contactsDataBase.updateContact(contactId, req.body);
  if (!contact) {
    return next(HttpError(404, "not found"));
  }

  return res.status(200).json(contact);
}

module.exports = {
  getContacts,
  getContact,
  addContact,
  removeContact,
  changeContact,
};
