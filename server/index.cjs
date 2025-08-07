const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.cjs');
const diaryRoutes = require('./routes/diary.cjs');
const musicRoutes = require('./routes/music.cjs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGODB_LOCAL || 'mongodb://localhost:27017/diary-app';
    
    await mongoose.connect(mongoURI, {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${mongoURI.includes('mongodb.net') ? 'Atlas Cloud' : 'Local'}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/music', musicRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Diary App API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});