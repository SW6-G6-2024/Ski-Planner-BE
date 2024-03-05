import { config } from 'dotenv';

// Load environment variables based on NODE_ENV

if (process.env.NODE_ENV === 'production') {
	config({ path: './config/.env.prod' });
} else {
	config({ path: './config/.env' });
}

// Access the environment variables
const keys = {
	googleClientID: process.env.GOOGLE_CLIENT_ID,
	googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
	mongoURI: process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'production' ? process.env.MONGO_URI : process.env.MONGO_URI_TEST,
	cookieKey: process.env.COOKIE_KEY,
	TOKEN_SECRET: process.env.TOKEN_SECRET,
	GMAIL_USER: process.env.GMAIL_USER,
	GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
	GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD,
	pathFindingUrl: process.env.PATHFINDING_URL,
};

export default keys;