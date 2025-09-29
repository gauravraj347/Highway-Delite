const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const { validateNoteCreation } = require('../utils/validation');
const noteController = require('../controllers/noteController');

const router = express.Router();

// Create a new note
router.post('/', validateNoteCreation, authenticateToken, handleValidationErrors, noteController.create);

// Delete a note
router.delete('/:id', authenticateToken, noteController.remove);

module.exports = router;
