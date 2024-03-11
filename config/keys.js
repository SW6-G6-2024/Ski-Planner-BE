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
  pathFindingUrl: process.env.RUNNING_IN_DOCKER ? process.env.PATHFINDING_URL_DOCKER : process.env.PATHFINDING_URL,
  ratingPredictionUrl: process.env.RATING_PRED_URL,
};

export default keys;