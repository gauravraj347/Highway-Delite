const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');

const app = express();
const PORT = process.env.PORT || 5000;



const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Body parsing middleware
app.use(express.json());

// MongoDB connection
const connectDB = require('./config/database');
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.get('/health',(req,res)=>{
  res.json({status:'OK',message:'Server is running'});
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;