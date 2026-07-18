import express from 'express';
import CalendarNoteModel from '../models/calendarNoteSchema.js';
import userAuth from '../middleware/userAuthentication.js';

const router = express.Router();

// GET all notes for the authenticated user
router.get('/', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const notes = await CalendarNoteModel.find({ authorId: userId });
        res.status(200).json({ status: true, notes });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Server error fetching notes.' });
    }
});

// POST a note for a specific date (creates or updates)
router.post('/', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const { date, note } = req.body;

        if (!date || !note) {
            return res.status(400).json({ status: false, message: 'Date and note are required.' });
        }

        let existingNote = await CalendarNoteModel.findOne({ date, authorId: userId });

        if (existingNote) {
            existingNote.note = note;
            await existingNote.save();
            return res.status(200).json({ status: true, message: 'Note updated successfully.', note: existingNote });
        } else {
            const newNote = new CalendarNoteModel({
                date,
                note,
                authorId: userId
            });
            await newNote.save();
            return res.status(201).json({ status: true, message: 'Note added successfully.', note: newNote });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Server error saving note.' });
    }
});

// DELETE a note for a specific date
router.delete('/:date', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const { date } = req.params;

        await CalendarNoteModel.findOneAndDelete({ date, authorId: userId });
        res.status(200).json({ status: true, message: 'Note deleted successfully.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Server error deleting note.' });
    }
});

export default router;
