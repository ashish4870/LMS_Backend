import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';
import { createQuestion, getQuestions, getQuestionById, updateQuestion, deleteQuestion, getQuestionByDifficulty } from '../services/question.service';
import Question from '../models/question.model';

const router = Router();

router.post('/questions', authenticate, authorizeAdmin, async (req, res) => {
  const { text, difficulty } = req.body;
  try {
    const question = await createQuestion(text, difficulty);
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json();
  }
});


router.get('/questions/random', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const question = await Question.aggregate([{ $sample: { size: 1 } }]);
    if (question.length === 0) return res.status(404).send('No questions found');
    res.json(question[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving random question', error });
  }
});


router.get('/questions', authenticate, authorizeAdmin, async (req, res) => {
  const questions = await getQuestions();
  res.json(questions);
});

router.get('/questions/:id', authenticate, authorizeAdmin, async (req, res) => {
  const question = await getQuestionById(req.params.id);
  if (!question) return res.status(404).send('Question not found');
  res.json(question);
});

router.put('/questions/:id', authenticate, authorizeAdmin, async (req, res) => {
  const { text, difficulty } = req.body;
  try {
    const question = await updateQuestion(req.params.id, text, difficulty);
    if (!question) return res.status(404).send('Question not found');
    res.json(question);
  } catch (error) {
    res.status(400).json();
  }
});

router.delete('/questions/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const question = await deleteQuestion(req.params.id);
    if (!question) return res.status(404).send('Question not found');
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(400).json();
  }
});

export default router;

