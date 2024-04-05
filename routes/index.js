import express from 'express';
const router = express.Router();

// Routes
import testRoutes from './testRoutes.js';
import routingRoutes from './routingRoutes.js';
import skiAreaRoutes from './skiAreaRoutes.js';
import userRoutes from './userRoutes.js';

// Print all routes defined in app
router.get('/api', (req, res) => {
	res.send(router.stack);
});

// Route definitions
router.use('/api/test', testRoutes);
router.use('/api/routes', routingRoutes);
router.use('/api/ski-areas', skiAreaRoutes);
router.use('/api/users', userRoutes);

export default router;
