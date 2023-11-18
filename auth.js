const express = require("express");

const router = express.Router();

const jsonParser = express.json();

const controller = require("./controllers.js");

const auth = require("./midleware/auth.js");

router.post("/users/register", jsonParser, controller.register);

router.post("/users/login", jsonParser, controller.login);

router.post("/users/logout", auth, controller.logout);

router.post("/users/current", auth, controller.currentUser);

module.exports = router;
