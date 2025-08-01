import mongoose from 'mongoose';

const testcaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  }
});

export default mongoose.model('Testcase', testcaseSchema);
