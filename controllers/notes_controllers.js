const Notes = require("../model/notes_model");

const getAllNotes = async (req, res) => {
  console.log(req.query.username);
  const AllNotes = await Notes.findOne({ username: req.query.username });
  //console.log(username);
  if (AllNotes) {
    // console.log(note);
    res.status(200).json({ DocumentId: AllNotes._id, note: AllNotes.note });
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

const updateNote = async (req, res) => {
  const documentId = req.params.documentId;
  const noteId = req.params.noteId;

  const { isArchived, isPinned } = req.body;

  const updateFields = {};

  if (isArchived !== undefined) {
    updateFields["note.$.isArchived"] = isArchived;
  }
  if (isPinned !== undefined) {
    updateFields["note.$.isPinned"] = isPinned;
  }

  try {
    const updatedNote = await Notes.updateOne(
      { _id: documentId, "note._id": noteId },
      {
        $set: updateFields,
      },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Document successfully updated", updatedNote });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating document" });
  }
};

module.exports = { getAllNotes, createNote, updateNote };
