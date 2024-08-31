import express from 'express';
import dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors'; // Import the CORS middleware and its type
import authRoutes from './routes/auth.routes';
import questionRoutes from './routes/question.routes';
import connectDB from './app';
import testRoutes from './routes/test.routes';

dotenv.config();

const app = express();

const corsOptions: CorsOptions = {
  origin: '*', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization'
};

app.use(cors(corsOptions)); 

connectDB();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', questionRoutes);
app.use('/api', testRoutes); 

app.get('/', (req, res) => {
  res.send('Welcome to the LMS API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
