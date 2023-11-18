const express = require("express");

const { v4: uuidv4 } = require("uuid");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const loader = require("./models/contacts.js");

const validator = require("./validator.js");

const User = require("./schemas/user.js");

const Contact = require("./schemas/contact.js");

const contactsList = async (req, res, next) => {
  try {
    const result = await loader.listContacts();
    if (result) {
      res.status(200).json(result);
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};
const someContacts = async (req, res, next) => {
  try {
    const result = await loader.someContacts(req.params.limit);
    if (result) {
      res.status(200).json(result);
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const filteredContacts = async (req, res, next) => {
  try {
    const result = await loader.listContacts();
    if (result) {
      const contactsFiltered = result.filter(
        (contact) => contact.favorite === req.params.favorite
      );
      res.status(200).json(contactsFiltered);
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const getContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const value = await validator.schemaId.validateAsync({
      id: id,
    });
    if (value) {
      res.status(400).json({ message: "Identifier is mot valid" });
    }
  } catch (error) {
    console.error(e);
    next(e);
  }
  try {
    const result = await loader.getContactById(id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};
const isFavorite = async (req, res, next) => {
  const { id } = req.params;
  try {
    const value = await validator.schemaId.validateAsync({
      id: id,
    });
    if (value) {
      res.status(400).json({ message: "Identifier is mot valid" });
    }
  } catch (error) {
    console.error(e);
    next(e);
  }
  try {
    const result = await loader.isFavorite(id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const addContact = async (req, res, next) => {
  const { name, email, phone, favorite } = req.body;

  req.body.id = uuidv4();

  try {
    const value = await validator.schema.validateAsync({
      id: id,
      rname: name,
      email: email,
      phone: phone,
      favorite: favorite,
    });
    if (value) {
      res.status(400).json({ message: "missing required name field" });
    }
  } catch (error) {
    console.error(e);
    next(e);
  }
  try {
    const result = await loader.addContact(req.body);
    if (result) {
      res.status(201).json(result);
    }
  } catch (error) {
    console.error(e);
    next(e);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const value = await validator.schemaId.validateAsync({
      id: req.params.contactId,
    });
    if (value) {
      res.status(400).json({ message: "Identifier is mot valid" });
    }
  } catch (error) {
    console.error(e);
    next(e);
  }
  try {
    const result = await loader.removeContact(req.params.contactId);
    if (result) {
      res.status(200).json({ message: "contact deleted" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.error(e);
    next(e);
  }
};

const updateContacts = async (req, res, next) => {
  if (!Object.keys(req.body).length) {
    res.status(400).json({ message: "missing field favorite" });
  } else {
    try {
      const result = await loader.updateStatusContact(
        req.params.contactId,
        req.body
      );
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } catch (error) {
      console.error(e);
      next(e);
    }
  }
};
const updateSubscription = async (req, res, next) => {
  const { subscription } = req.body;

  try {
    const user = await User.findOne({ subscription });
    const result = await User.findByIdAndUpdate(user.subscription, [
      "starter",
      "pro",
      "business",
    ]);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.error(e);
    next(e);
  }
};
const register = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const value = await validator.schemaRegister.validateAsync({
      email: email,
      password: password,
    });
    if (value) {
      res.send({
        Status: (400)["Bad Request"],
        "Content-Type": "application/json",
        ResponseBody: "missing required name field",
      });
    }
  } catch (error) {
    console.error(e);
    next(e);
  }
  const user = await User.findOne({ email });
  if (user) {
    return res.send({
      Status: (409)["Conflict"],
      "Content-Type": "application/json",
      ResponseBody: {
        message: "Email in use",
      },
    });
  }
  try {
    const passwordHashed = await bcrypt.hash(password, 10);
    await User.create({ email, password: passwordHashed });

    return res.send({
      Status: (201)["Created"],
      "Content-Type": "application/json",
      ResponseBody: {
        user: {
          email: "example@example.com",
          subscription: "starter",
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const value = await validator.schemaLogin.validateAsync({
      email: email,
      password: password,
    });
    if (value) {
      res.send({
        Status: (400)["Bad Request"],
        "Content-Type": "application/json",
        ResponseBody: "missing required name field",
      });
    }
  } catch (error) {
    console.error(e);
    next(e);
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.send({
        Status: (401)["Unauthorized"],
        ResponseBody: {
          message: "Email or password is wrong",
        },
      });
    } else {
      const matched = bcrypt.compare(password, user.password);

      if (!matched) {
        return res.send({
          Status: (401)["Unauthorized"],
          ResponseBody: {
            message: "Email or password is wrong",
          },
        });
      } else {
        const token = jwt.sign(
          { id: user._id, name: user.name },
          process.env["JWT_SECRET"],
          { expiresIn: "1h" }
        );
        await User.findByIdAndUpdate(user._id, { token });
        return res.send({
          Status: (200)["OK"],
          "Content-Type": "application/json",
          ResponseBody: {
            token: "exampletoken",
            user: {
              email: "example@example.com",
              subscription: "starter",
            },
          },
        });
      }
    }
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const log = await User.findByIdandUpdate(req.user.id, { token: null });

    if (log) {
      return res.send({ Status: (204)["No Content"] });
    } else {
      return res.send({
        Status: (401)["Unauthorized"],
        "Content-Type": "application/json",
        ResponseBody: {
          message: "Not authorized",
        },
      });
    }
  } catch (err) {
    next(err);
  }
};

const currentUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findById(id).exec();
    if (!contact) {
      return res.status(404).send({
        message: "Not found",
      });
    }
    if (contact.owner.toString() !== req.user.id) {
      return res.send({
        Status: (401)["Unauthorized"],
        "Content-Type": "application/json",
        ResponseBody: {
          message: "Not authorized",
        },
      });
    } else {
      return res.send({
        Status: (200)["OK"],
        "Content-Type": "application/json",
        ResponseBody: {
          email: "example@example.com",
          subscription: "starter",
        },
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  contactsList,
  getContact,
  removeContact,
  addContact,
  updateContacts,
  isFavorite,
  register,
  login,
  logout,
  currentUser,
  someContacts,
  filteredContacts,
  updateSubscription,
};
