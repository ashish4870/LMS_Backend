import Test, { ITest } from '../models/test.model';
import { Types } from 'mongoose';

export const createTest = async (userId: string) => {
    const newTest = new Test({
      userId,
      questions: [],
      score: 0,
      completed: false
    });
  
    return await newTest.save();
  };
  

export const getTestById = async (testId: string): Promise<ITest | null> => {
  return await Test.findById(testId);
};

export const updateTest = async (testId: string, updates: Partial<ITest>): Promise<ITest | null> => {
  return await Test.findByIdAndUpdate(testId, updates, { new: true });
};

export const calculateScore = (test: any) => {
    return test.questions.reduce((score: number, q: any) => {
      if (q.answer === 'correct') {
        return score + 1;
      }
      return score;
    }, 0);
  };