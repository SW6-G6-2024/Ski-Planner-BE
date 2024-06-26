import express from 'express';
const router = express.Router();

// Routes
import routingRoutes from './routingRoutes.js';
import skiAreaRoutes from './skiAreaRoutes.js';
import ratePisteRoutes from './ratingRoutes.js';
import userRoutes from './userRoutes.js';

// Print all routes defined in app
router.get('/api', (req, res) => {
	res.send(router.stack);
});

// Route definitions
router.use('/api/routes', routingRoutes);
router.use('/api/ski-areas', skiAreaRoutes);
router.use('/api/rate-piste', ratePisteRoutes);
router.use('/api/users', userRoutes);

export default router;
