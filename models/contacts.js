const Contact = require("./schemas/contact");

const listContacts = async () => {
  return Contact.find();
};

const someContacts = async (limit) => {
  return Contact.find().limit(limit);
};

const getContactById = async (contactId) => {
  return Contact.findOne({ _id: contactId });
};

const removeContact = async (contactId) => {
  return Contact.findByIdAndRemove({ _id: contactId });
};

const addContact = async (body) => {
  return Contact.create(body);
};

const updateStatusContact = async (contactId, body) => {
  return Contact.findByIdAndUpdate({ _id: contactId }, body, { new: true });
};

const isFavorite = async (contactId) => {
  return Contact.findOne({ _id: contactId }).favorite;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateStatusContact,
  isFavorite,
  someContacts,
};
