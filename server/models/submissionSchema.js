import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileUrl: {
        type: String,
        required: true // The submitted file
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    evaluated: {
        type: Boolean,
        default: false
    }
});

const SubmissionModel = mongoose.model('Submission', submissionSchema);
export default SubmissionModel;
