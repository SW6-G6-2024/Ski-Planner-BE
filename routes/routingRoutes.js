import express from 'express';
const router = express.Router();

// Routes
router.get('/', (req, res) => {
	res.status(200).send({route: 'Dis way!'});
});

export default router;