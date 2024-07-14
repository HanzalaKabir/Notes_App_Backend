const mongoose = require("mongoose");

const notes_schema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    note: [
      {
        title: { type: String },
        note: { type: String, required: true },
        isArchived: { type: Boolean, required: true },
        isPinned: { type: Boolean, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notes", notes_schema);
