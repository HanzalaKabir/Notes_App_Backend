const express = require("express");
const Router = express.Router();

const { createUser } = require("../controllers/signup_controller");
const { findUser } = require("../controllers/login_controller");

Router.route("/signup").post(createUser);
Router.route("/login").post(findUser);

module.exports = Router;
