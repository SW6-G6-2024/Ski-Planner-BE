import express from 'express';
const router = express.Router();
import SkiAreaModel from '../models/SkiAreas.js';

// Routes
router.get('/', (req, res) => {
	res.status(200).send('Hello World');
});

export default router;