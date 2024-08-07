const Notes = require("../model/notes_model");

const getAllNotes = async (req, res) => {
  console.log(req.query.username);
  const AllNotes = await Notes.findOne({ username: req.query.username });
  //console.log(username);
  if (AllNotes) {
    // console.log(note);
    res.status(200).json(AllNotes.note);
  } else {
    res.status(404).json({ msg: "User does not exists" });
  }
};

const createNote = async (req, res) => {
  try {
    console.log(req.body);
    let user = await Notes.findOne({ username: req.body.username });
    if (!user) {
      // Handle the case where the user is not found
      return res.status(404).send("User not found");
    }
    user.note.push(req.body.note);
    await user.save();
    res.status(201).json({ message: "Note created successfully", user });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error creating note", err });
  }
};

module.exports = { getAllNotes, createNote };
