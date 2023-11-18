const express = require("express");

const router = express.Router();

const controller = require("./controllers.js");

router.get("/", controller.contactsList);

router.get("/contacts?page=1&limit=20", controller.someContacts);

router.get("/contacts?favorite=true", controller.filteredContacts);

router.get("/:contactId", controller.getContact);

router.get("/:contactId", controller.isFavorite);

router.post("/", controller.addContact);

router.delete("/:contactId", controller.removeContact);

router.put("/:contactId", controller.updateContacts);

router.patch("/users", controller.updateSubscription);

module.exports = router;
