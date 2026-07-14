import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    fileUrl: { type: String }, // Optional attachment from teacher
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const AssignmentModel = mongoose.model('Assignment', assignmentSchema);
export default AssignmentModel;
