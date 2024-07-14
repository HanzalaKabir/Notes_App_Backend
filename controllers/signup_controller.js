const CryptoJS = require("crypto-js");
const User = require("../model/user_model");
const note = require("../model/notes_model");

const createUser = async (req, res) => {
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
    await newUser
      .save()
      .then(await newNote.save())
      .catch(async (err) => {
        console.log(err);
        console.log("I am throwing up");
        await User.findOneAndDelete({ username: noteObject.username });
      });

    res.status(201).json({ message: "User created successfully", newUser });
  } catch (err) {
    console.log("I am throwing ");
    res.status(400).json({ message: "Error creating user", err });
  }
};

module.exports = { createUser };
