import { Router } from 'express';
import { register, login } from '../services/auth.service';

const router = Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await register(username, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json();
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const { token, user } = await login(username, password);
    res.json({ token, user });
  } catch (error) {
    res.status(400).json();
  }
});

export default router;
