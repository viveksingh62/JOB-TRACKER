import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRoute from './routes/analyze.js';
import applicationsRoute from './routes/application.js'

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/analyze', analyzeRoute);
app.use('/api/applications', applicationsRoute);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log('Server running on port 5000');
      console.log('MongoDB connected');
    });
  })
  .catch(err => console.error('MongoDB error:', err));