import { config } from 'dotenv';

// Load environment variables based on NODE_ENV

if (process.env.NODE_ENV === 'production') {
  config({ path: './config/.env.prod' });
} else {
  config({ path: './config/.env' });
}

// Access the environment variables
const keys = {
  mongoURI: process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'production' ? process.env.MONGO_URI : process.env.MONGO_URI_TEST,
  pathFindingUrl: process.env.PATHFINDING_URL,
  ratingPredictionUrl: process.env.RATING_PRED_URL,
  auth0Domain: process.env.AUTH0_DOMAIN,
  auth0ClientSecret: process.env.AUTH0_CLIENT_SECRET,
  auth0ClientId: process.env.AUTH0_CLIENT_ID,
};

export default keys;