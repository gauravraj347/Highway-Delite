const Note = require('../models/Note');

async function createNote({ userId, title }) {
	const note = new Note({ title, author: userId });
	await note.save();
	return note;
}

async function deleteNote({ userId, noteId }) {
	const note = await Note.findOneAndDelete({ _id: noteId, author: userId });
	return note;
}

module.exports = {
	createNote,
	deleteNote
};

