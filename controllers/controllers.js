const { MyError } = require("../helpers/index");
const { Contact } = require("../models/contacts");

async function getContacts(req, res) {
  const { id } = req.user;
  const contacts = await Contact.find({ owner: id }).populate(
    "owner",
    "_id name email"
  );

  return res.json(contacts);
}

async function getContact(req, res, next) {
  const { contactId } = req.params;
  const { id: userId } = req.user;
  const contact = await Contact.findOne({ _id: contactId, owner: userId });
  if (!contact) {
    return next(new MyError("Not Found", 404));
  }
  return res.json(contact);
}

async function addContact(req, res) {
  const { name, email, phone, favorite = false } = req.body;
  const { id } = req.user;
  const newContact = await Contact.create({
    name,
    email,
    phone,
    favorite,
    owner: id,
  });
  return res.status(201).json(newContact);
}

async function removeContact(req, res, next) {
  const { contactId } = req.params;
  const { id: userId } = req.user;
  const contact = await Contact.findOneAndDelete({
    _id: contactId,
    owner: userId,
  });
  if (!contact) {
    return next(new MyError("No Contact", 404));
  }

  return res.status(200).json(contact);
}

async function changeContact(req, res, next) {
  const { contactId } = req.params;
  const { id: userId } = req.user;
  const contact = await Contact.findByIdAndUpdate(
    { _id: contactId, owner: userId },
    req.body
  );
  if (!contact) {
    return next(new MyError("Not Found", 404));
  }

  return res.status(200).json(contact);
}

async function updateStatusContact(req, res, next) {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const { id: userId } = req.user;

  const contact = await Contact.findByIdAndUpdate(
    { _id: contactId, owner: userId },
    { favorite },
    {
      new: true,
    }
  );
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
  updateStatusContact,
};
