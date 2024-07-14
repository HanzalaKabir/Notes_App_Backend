const express = require("express");
const Router = express.Router();

const { getAllNotes, createNote } = require("../controllers/notes_controllers");
const { verifyToken } = require("../controllers/login_controller");

Router.route("/").get(verifyToken, getAllNotes);
Router.route("/").post(verifyToken, createNote);

module.exports = Router;
