import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  text: string;
  difficulty: number;
  answer: number;
}

const QuestionSchema: Schema = new Schema({
  text: { type: String, required: true },
  difficulty: { type: Number, required: true },
  answer: {type: Number, required: true}
});

const Question = mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;
