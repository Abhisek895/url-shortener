const express = require('express');
const { nanoid } = require('nanoid');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/shorten', auth, async (req, res) => {
  try {
    const { original_url } = req.body;
    const user_id = req.user.id;
    
    // Validate URL basic
    if (!original_url || !original_url.startsWith('http')) {
        return res.status(400).json({ error: 'Valid URL is required' });
    }

    // Generate unique short code
    const short_code = nanoid(8); // 8 character id
    
    await pool.query(
      'INSERT INTO links (original_url, short_code, user_id) VALUES (?, ?, ?)',
      [original_url, short_code, user_id]
    );

    res.status(201).json({ short_code, original_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/links', auth, async (req, res) => {
  try {
    const user_id = req.user.id;
    const [rows] = await pool.query('SELECT * FROM links WHERE user_id = ? ORDER BY created_at DESC', [user_id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
