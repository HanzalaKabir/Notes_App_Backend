const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./connectDB/connectDB");
const notes_router = require("./routes/notes_router");
const auth_router = require("./routes/auth_router");
const deletedNotes_router = require("./routes/deletedNotes_router");

const app = express();

app.use(
  cors({
    origin: true, // Allow all origins
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Specify allowed methods
    credentials: true, // Allow credentials if needed (like cookies or authorization headers)
  })
);

app.use(express.json());
connectDB();

const PORT = 3500;

app.get("/", (req, res) => {
  res.send("Hi, I am live");
});

//middleware to set router

app.use("/api/notes", notes_router);
app.use("/api/auth", auth_router);
app.use("/api/deletedNotes", deletedNotes_router);

mongoose.connection.once("open", () => {
  console.log("Connected to DB");
  app.listen(process.env.PORT || PORT, () => {
    console.log("Server is UP and Running");
  });
});
