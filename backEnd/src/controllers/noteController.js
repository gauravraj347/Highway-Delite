const noteService = require('../services/noteService');

async function create(req, res, next) {
	try {
		const note = await noteService.createNote({ userId: req.user._id, title: req.body.title });
		res.status(201).json({ success: true, message: 'Note created successfully', data: { note } });
	} catch (err) {
		next(err);
	}
}

async function remove(req, res, next) {
	try {
		const note = await noteService.deleteNote({ userId: req.user._id, noteId: req.params.id });
		if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
		res.json({ success: true, message: 'Note deleted successfully' });
	} catch (err) {
		next(err);
	}
}

module.exports = {
	create,
	remove
};

