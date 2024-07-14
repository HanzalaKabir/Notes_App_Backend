const deleted_notes_schema = require("../model/deleted_notes_model");
const notes_schema = require("../model/notes_model");

const deletedNotes = async (req, res) => {
  try {
    let deletedNote;
    const AllNotes = await notes_schema.findOne({
      username: req.body.username,
    });

    //console.log(AllNotes);
    AllNotes.note = AllNotes.note.filter((note) => {
      id = note._id.toString();

      if (id !== req.body._id) {
        return note;
      } else {
        deletedNote = {
          title: note.title,
          note: note.note,
          isArchived: note.isArchived,
          isPinned: note.isPinned,
        };
      }
    });
    //console.log(AllNotes.note);
    await AllNotes.save();
    const note = await deleted_notes_schema.findOne({
      username: req.body.username,
    });
    if (note) {
      note.deletedNote.push(deletedNote);
      await note.save();
      //console.log(note);
    } else {
      const noteObject = {
        username: req.body.username,
        deletedNote: [deletedNote],
      };
      const newNote = new deleted_notes_schema(noteObject);
      await newNote.save();
      //console.log(newNote);
    }
    res.status(201).json({ msg: "Note created Successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
    console.log(err);
  }
};

module.exports = deletedNotes;
