const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const dataBasePath = path.resolve(__dirname, "contacts.json");

async function readDataBase() {
  const dataBaseRaw = await fs.readFile(dataBasePath);
  const dataBase = JSON.parse(dataBaseRaw);
  return dataBase;
}

async function writeDataBase(dataBase) {
  await fs.writeFile(dataBasePath, JSON.stringify(dataBase, null, 2));
}

const listContacts = async () => {
  const dataBase = await readDataBase();
  return dataBase;
};

const getContactById = async (contactId) => {
  const dataBase = await readDataBase();
  const contact = dataBase.find((contact) => contact.id === contactId);

  return contact || null;
};

const deleteContact = async (contactId) => {
  const dataBase = await readDataBase();
  const updatedDataBase = dataBase.filter(
    (contact) => contact.id !== contactId
  );
  await writeDataBase(updatedDataBase);
};

const createContact = async (name, email, phone) => {
  const id = uuidv4();
  const contact = { id, name, email, phone };
  const dataBase = await readDataBase();
  dataBase.push(contact);

  await writeDataBase(dataBase);

  return contact;
};

const updateContact = async (contactId, body) => {
  try {
    const dataBase = await readDataBase();
    const index = dataBase.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
      return null;
    }
    dataBase[index] = { id: contactId, ...body };
    await writeDataBase(dataBase);
    return dataBase[index];
  } catch (err) {
    return console.log(err.message);
  }
};

module.exports = {
  listContacts,
  getContactById,
  deleteContact,
  createContact,
  updateContact,
};
