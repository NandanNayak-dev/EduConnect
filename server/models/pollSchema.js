import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{
        text: { type: String, required: true },
        votes: { type: Number, default: 0 }
    }],
    votedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

const PollModel = mongoose.model('Poll', pollSchema);
export default PollModel;
