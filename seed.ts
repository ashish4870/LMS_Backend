import dotenv from 'dotenv';
dotenv.config(); 

import mongoose from 'mongoose';
import Question from './src/models/question.model';
import connectDB from './src/app';

const generateRandomDifficulty = () => Math.floor(Math.random() * 10) + 1;

const generateMathQuestion = () => {
  const difficulty = generateRandomDifficulty();
  let num1, num2, question, answer;

  if (difficulty <= 3) {
    num1 = Math.floor(Math.random() * 50) + 1;
    num2 = Math.floor(Math.random() * 50) + 1;
    if (Math.random() > 0.5) {
      question = `${num1} + ${num2}`;
      answer = num1 + num2;
    } else {
      question = `${num1} - ${num2}`;
      answer = num1 - num2;
    }
  } else if (difficulty <= 6) {
    num1 = Math.floor(Math.random() * 12) + 1;
    num2 = Math.floor(Math.random() * 12) + 1;
    if (Math.random() > 0.5) {
      question = `${num1} * ${num2}`;
      answer = num1 * num2;
    } else {
      question = `${num1 * num2} / ${num1}`;
      answer = num2;
    }
  } else {
    num1 = Math.floor(Math.random() * 100) + 1;
    num2 = Math.floor(Math.random() * 100) + 1;
    const num3 = Math.floor(Math.random() * 100) + 1;
    question = `${num1} + ${num2} - ${num3}`;
    answer = num1 + num2 - num3;
  }

  return {
    text: `${question} = ?`,
    difficulty,
    answer
  };
};

const seedQuestions = async () => {
  await connectDB();

  const questions = Array.from({ length: 500 }).map(() => ({
    ...generateMathQuestion(),
    weight: Math.floor(Math.random() * 10) + 1
  }));

  try {
    await Question.insertMany(questions);
    console.log('500 questions inserted successfully');
  } catch (error) {
    console.error('Error inserting questions:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedQuestions();
