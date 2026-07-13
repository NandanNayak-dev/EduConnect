import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  joinCode: {
    type: String,
    required: true,
    unique: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ClassModel = mongoose.model('Class', classSchema);
export default ClassModel;
