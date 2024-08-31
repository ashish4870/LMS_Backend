import Question, { IQuestion } from '../models/question.model';

export const createQuestion = async (text: string, difficulty: number) => {
  const question = new Question({ text, difficulty });
  return await question.save();
};

export const getQuestions = async () => {
  return await Question.find();
};

export const getQuestionById = async (id: string) => {
  return await Question.findById(id);
};

export const updateQuestion = async (id: string, text: string, difficulty: number) => {
  return await Question.findByIdAndUpdate(id, { text, difficulty }, { new: true });
};

export const deleteQuestion = async (id: string) => {
  return await Question.findByIdAndDelete(id);
};

export const getQuestionByDifficulty = async (difficulty: number) => {
  const question = await Question.aggregate([
    { $match: { difficulty } },
    { $sample: { size: 1 } }
  ]);

  return question.length > 0 ? question[0] : null;
};
