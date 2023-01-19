import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: 'string',
      required: [true, 'please provide company'],
      maxlength: 50,
      trim: true,
    },
    position: {
      type: 'string',
      required: [true, 'please provide position'],
      maxlength: 100,
    },
    status: {
      type: 'string',
      enum: ['interview', 'declined', 'pending'],
      default: 'pending',
    },
    jobType: {
      type: 'string',
      enum: ['full-time', 'part-time', 'remote', 'internship'],
      default: 'internship',
    },
    jobLocation: {
      type: 'string',
      default: 'my city',
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'please provide user'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Job', JobSchema);
