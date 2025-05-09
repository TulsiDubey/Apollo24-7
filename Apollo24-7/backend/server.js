
// This file would be in a separate backend project
// Below is an example of how you would set it up
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const doctorsRoutes = require('./routes/doctors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/healthvista', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

// Routes
app.use('/api/doctors', doctorsRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Apollo 24*7 API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/*
 * To run this server:
 * 1. Install dependencies: npm install express mongoose cors axios cheerio
 * 2. Make sure MongoDB is running locally or update connection URL
 * 3. Run with: node server.js
 */
