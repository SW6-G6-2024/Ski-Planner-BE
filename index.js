// Constant requires
import cors from './settings/cors.js';

import express, { json } from 'express';
import { connectToDb } from './db/index.js';
import keys from './config/keys.js';
import cookieSession from 'cookie-session';
import router from './routes/index.js';
import pspt from 'passport';

const PORT = process.env.PORT || 8888; // Get dynamic port allocation when deployed by Heroku. Otherwise, by default, use port 5000

// Setup connection to database
connectToDb(keys.mongoURI, {
	dbName: process.env.NODE_ENV === 'production' ? 'prod' : 'test',
}, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

const app = express(); // Configuration for listening, communicate to handlers

// Simple logging middleware for testing
app.use((req, res, next) => {
	req.protocol + '://' + req.get('host') + req.originalUrl;
	next();
});
app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie should last for 30 days before automatic expiration
		keys: [keys.cookieKey], // Specify encryption key for cookie
	})
);
app.use(pspt.initialize());
app.use(pspt.session());
app.use(json());
app.use(cors);
app.use('', router);
app.use('/files', express.static('public'))

// Run server
app.listen(PORT, () => {
	console.log(`⚡ Running app at ${'http://localhost'}:${PORT}`);
});