const CryptoJS = require("crypto-js");
const User = require("../model/user_model");
const note = require("../model/notes_model");
const { default: mongoose } = require("mongoose");

const createUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log(req.body);
    const encryptedPassword = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET_KEY
    ).toString();

    const userObject = {
      username: req.body.username,
      number: req.body.number,
      email: req.body.email,
      password: encryptedPassword,
    };
    const noteObject = {
      username: req.body.username,
      note: [
        {
          title: "Welcome Note",
          note: "Thank you for using our app",
          isArchived: false,
          isPinned: true,
        },
      ],
    };

    const newUser = new User(userObject);
    const newNote = new note(noteObject);

    try {
      await newUser.save({ session });
      await newNote.save({ session });
      await session.commitTransaction();
      session.endSession();
      res.status(201).json({ message: "User created successfully", newUser });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error saving user or note:", err);
      if (err.code === 11000) {
        const dupName = await User.findOne({ username: userObject.username });
        const dupEmail = await User.findOne({ email: userObject.email });
        const dupNumber = await User.findOne({ number: userObject.number });

        if (dupName && dupEmail && dupNumber) {
          res
            .status(400)
            .json({ message: "User already exists, please login" });
        } else if (dupName) {
          res.status(400).json({ message: "Username already exists" });
        } else if (dupEmail) {
          res.status(400).json({ message: "Email already exists" });
        } else if (dupNumber) {
          res.status(400).json({ message: "Number already exists" });
        } else {
          res.status(400).json({
            message: "Username, email, or number already exists",
            err,
          });
        }
      } else {
        res.status(400).json({ message: "Could not save user or note", err });
      }
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Server error", err });
  }
};

module.exports = { createUser };
