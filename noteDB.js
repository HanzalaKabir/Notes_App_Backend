require("dotenv").config();
const connectDB = require("./connectDB/connectDB");
const Notes = require("./model/notes_model");

const notesJSON = require("./notes.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    await Notes.create(notesJSON);
    console.log("success");
  } catch (error) {
    console.log(error);
  }
};
start();
