import { Router, Request, Response } from 'express';
import { createTest, getTestById } from '../services/test.service';
import Question from '../models/question.model';
import { v4 as uuidv4 } from 'uuid';
import Test from '../models/test.model';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';
import { sample } from 'lodash';

const router = Router();

router.post('/tests', authenticate, async (req: Request, res: Response) => {
  console.log(req.body, 'this is')
  try {
    const { userId } = req.body;
    const test = await createTest(userId);
    const uniqueURL = `/test/${test._id}-${uuidv4()}`;
    console.log(uniqueURL, test);
    res.status(201).json({ test, uniqueURL });
  } catch (error) {
    res.status(500).json({ message: 'Error creating test', error });
  }
});

router.get('/tests/:testId', authenticate, async (req: Request, res: Response) => {
  try {
    const test = await getTestById(req.params.testId);
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving test', error });
  }
});

router.post('/tests/:testId/update', authenticate, async (req: Request, res: Response) => {
  console.log('yes')
  const { testId } = req.params;
  const { questionId, answer, score, difficulty } = req.body;
  console.log('Received data:', { testId, questionId, answer, score, difficulty });

  try {
    const currentQuestion = await Question.findById(questionId);

    if (!currentQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    test.questions.push({
      question: currentQuestion.text,
      answer,
      score,
      difficulty
    });

    test.totalScore = test.questions.reduce((sum, q) => sum + q.score, 0);

    const nextDifficulty = difficulty + (score > 0 ? 1 : -1);

    const availableQuestions = await Question.find({ difficulty: nextDifficulty });

    const askedQuestions = new Set(test.questions.map(q => q.question));

    const filteredQuestions = availableQuestions.filter(q => !askedQuestions.has(q.text));

    if (filteredQuestions.length === 0) {
      return res.status(404).json({ error: 'No question found for next difficulty' });
    }
    const nextQuestion = sample(filteredQuestions);

    if (!nextQuestion) {
      return res.status(404).json({ error: 'No question found for next difficulty' });
    }

    await test.save();
    if (test.questions.length >= 5) {
      test.completed = true;
      await test.save();
      return res.status(200).json({ message: 'Test completed', totalScore: test.totalScore });
    }

    res.status(200).json({ nextQuestion, totalScore: test.totalScore });
  } catch (error) {
    console.error('Backend error:', error);
    res.status(400).json({ error: 'Failed to update test' });
  }
});

export default router;
