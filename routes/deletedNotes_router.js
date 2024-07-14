const express = require("express");
const Router = express.Router();
const deletedNotes = require("../controllers/deleted_notes_controller");
const { verifyToken } = require("../controllers/login_controller");

Router.route("/").post(verifyToken, deletedNotes);

module.exports = Router;
