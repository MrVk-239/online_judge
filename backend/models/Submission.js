import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  language: { type: String, required: true },
  code: { type: String, required: true },
  passed: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Submission', submissionSchema);
