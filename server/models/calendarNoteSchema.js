import mongoose from 'mongoose';

const calendarNoteSchema = new mongoose.Schema({
    date: {
        type: String, // Storing as 'YYYY-MM-DD' for easy querying
        required: true,
    },
    note: {
        type: String,
        required: true,
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const CalendarNoteModel = mongoose.model('CalendarNote', calendarNoteSchema);

export default CalendarNoteModel;
