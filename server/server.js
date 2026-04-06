const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const quizRoutes = require('./routes/quizRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const chatRoutes = require('./routes/chatRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const udemyRoutes = require('./routes/udemyRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// App Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/udemy', udemyRoutes);
app.use('/api/notifications', notificationRoutes);

// --- Production Deployment Logic ---
if (process.env.NODE_ENV === 'production') {
  // Serve static files from React's dist folder
  const clientDistPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDistPath));

  // Catch-all route to serve index.html for React Router sub-pages
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(clientDistPath, 'index.html'));
  });
} else {
  // Basic Health Check for Development
  app.get('/', (req, res) => {
    res.send('AI-Driven Career Guidance Portal API is running in Development mode...');
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
