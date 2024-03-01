import express from 'express';
const router = express.Router();

// Routes
router.get('/', (req, res) => {
	res.status(200).send('Hello World');
});

export default router;