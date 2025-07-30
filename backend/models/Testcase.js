// models/Testcase.js
import mongoose from 'mongoose';

const testcaseSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  },
  input: {
    type: String,
    required: true,
  },
  output: {
    type: String,
    required: true,
  },
  isSample: {
    type: Boolean,
    default: false, // True if it's a sample testcase (visible to users)
  },
});

export default mongoose.model('Testcase', testcaseSchema);
