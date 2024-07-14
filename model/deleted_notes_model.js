const mongoose = require("mongoose");
const expirationTime = new Date();
expirationTime.setSeconds(expirationTime.getSeconds());
const deleted_notes_schema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    deletedNote: [
      {
        title: { type: String },
        note: { type: String, required: true },
        isArchived: { type: Boolean, required: true },
        isPinned: { type: Boolean, required: true },
      },
    ],
    expiresAfter: { type: Date, default: Date.now, expires: expirationTime },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Deleted_Notes", deleted_notes_schema);
