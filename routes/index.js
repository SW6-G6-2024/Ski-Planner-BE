const router = require('express').Router();
// Routes
const testRoutes = require('./testRoutes');

// Print all routes defined in app
router.get('/api', (req, res) => {
	res.send(router.stack);
});



// Test route
router.use('/api/test', testRoutes);


module.exports = router;
