import mongoose, { Schema, Document } from 'mongoose';

export interface ITest extends Document {
  userId: string;
  questions: Array<{ question: string; answer: string; score: number; difficulty: number }>; // Added difficulty here
  totalScore: number;
  completed: boolean;
}

const TestSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
      score: {
        type: Number,
        required: true,
      },
      difficulty: {
        type: Number,
        required: true,
      }
    },
  ],
  totalScore: {
    type: Number,
    required: true,
    default: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

TestSchema.pre('save', function (next) {
  const test = this as unknown as ITest;

  test.totalScore = test.questions.reduce((sum, question) => sum + question.score, 0);

  next();
});

const Test = mongoose.model<ITest>('Test', TestSchema);

export default Test;
