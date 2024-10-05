const express = require("express");
const Router = express.Router();

const {
  getAllNotes,
  createNote,
  updateNote,
} = require("../controllers/notes_controllers");
const { verifyToken } = require("../controllers/login_controller");

Router.route("/").get(verifyToken, getAllNotes);
Router.route("/").post(verifyToken, createNote);
Router.route("/update/:documentId/:noteId").patch(verifyToken, updateNote);

module.exports = Router;
