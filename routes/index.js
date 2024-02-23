import express from 'express';
const router = express.Router();
// Routes
import testRoutes from './testRoutes.js';
import routingRoutes from './routingRoutes.js';

// Print all routes defined in app
router.get('/api', (req, res) => {
	res.send(router.stack);
});



// Test route
router.use('/api/test', testRoutes);
router.use('/api/route', routingRoutes);


export default router;
