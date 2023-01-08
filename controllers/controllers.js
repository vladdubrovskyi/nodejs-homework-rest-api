const {
  listContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
} = require("../models/contacts");
const { MyError } = require("../helpers/index");

async function getContacts(_, res) {
  const contacts = await listContacts();
  return res.json(contacts);
}

async function getContact(req, res, next) {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    return next(new MyError("Not Found", 404));
  }
  return res.json(contact);
}

async function addContact(req, res) {
  const { name, email, phone } = req.body;
  const newContact = await createContact(name, email, phone);
  return res.status(201).json(newContact);
}

async function removeContact(req, res, next) {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    return next(new MyError("No Contact", 404));
  }
  await deleteContact(contactId);
  return res.status(200).json(contact);
}

async function changeContact(req, res, next) {
  const { contactId } = req.params;
  const contact = await updateContact(contactId, req.body);
  if (!contact) {
    return next(new MyError("Not Found", 404));
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
