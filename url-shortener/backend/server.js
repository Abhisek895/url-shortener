const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const linkRoutes = require('./routes/links');
const pool = require('./db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Main API Routes
app.use('/api', authRoutes);
app.use('/api', linkRoutes);

// Base route for health check
app.get('/', (req, res) => {
  res.send('URL Shortener API is running');
});

// Redirect Route
app.get('/:shortcode', async (req, res) => {
  try {
    const { shortcode } = req.params;
    const [rows] = await pool.query('SELECT original_url FROM links WHERE short_code = ?', [shortcode]);
    
    if (rows.length > 0) {
      return res.redirect(rows[0].original_url);
    } else {
      return res.status(404).send('Link not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
