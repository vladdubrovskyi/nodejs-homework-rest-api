const { MyError } = require("../helpers/index");
const { Contact } = require("../models/contacts");

async function getContacts(_, res) {
  const contacts = await Contact.find();
  console.log(contacts);
  return res.json(contacts);
}

async function getContact(req, res, next) {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);
  if (!contact) {
    return next(new MyError("Not Found", 404));
  }
  return res.json(contact);
}

async function addContact(req, res) {
  const { name, email, phone } = req.body;
  const newContact = await Contact.create({ name, email, phone });
  return res.status(201).json(newContact);
}

async function removeContact(req, res, next) {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);
  if (!contact) {
    return next(new MyError("No Contact", 404));
  }
  await Contact.findByIdAndRemove(contactId);
  return res.status(200).json(contact);
}

async function changeContact(req, res, next) {
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndUpdate(contactId, req.body);
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
