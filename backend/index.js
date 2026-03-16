import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRoute from './routes/analyze.js';
import applicationsRoute from './routes/application.js'
import  {limiter,globalLimiter} from "./middleware/rateLimiter.js"
dotenv.config();
const app = express();

const allowedOrigins = [
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log('Server running on port 8080');
      console.log('MongoDB connected');
    });
  })
  .catch(err => console.error('MongoDB error:', err));

app.use('/api/analyze', limiter,analyzeRoute);
app.use('/api/applications', applicationsRoute);


app.get("/",(req,res)=>{
  res.send("hey vivek")
})


