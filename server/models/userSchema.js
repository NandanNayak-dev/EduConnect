import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ["student", "teacher", "admin"]
  },
  image: {
    type: String,
    default: null
  },
  usn: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  otp: {
    type: String
  },
  otpExpires: {
    type: Date
  }
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel
