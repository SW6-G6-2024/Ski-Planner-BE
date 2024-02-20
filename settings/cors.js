const cors = require('cors');

const corsConfig = {
	origin: [
		'http://127.0.0.1:3000',
		'http://localhost:3000',
	],
	optionsSuccessStatus: 200,
	exposedHeaders: ['Content-Range', 'X-Content-Range'],
};

// Export cors with config
module.exports = cors(corsConfig);
