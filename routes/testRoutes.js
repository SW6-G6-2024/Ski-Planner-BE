import express from 'express';
import regexPatterns from '../utils/patterns.js';
const router = express.Router();

// Routes
router.get('/', (req, res) => {
	const w = regexPatterns.website.test('https://www.example.');
	res.status(200).send('Hello World');
});

export default router;