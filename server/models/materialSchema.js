import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String },
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
    createdAt: { type: Date, default: Date.now },
});

const MaterialModel = mongoose.model('Material', materialSchema);
export default MaterialModel;
