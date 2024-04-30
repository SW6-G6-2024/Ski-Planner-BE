import { connectToDb } from './index.js';
import env from '../config/keys.js';
import { updateUsers } from './updateDocuments.js';

const db = connectToDb(env.mongoURI);

switch (process.argv[2]) {
	case 'users':
		await updateUsers();
		await closeDb();
		break;
	case 'pistes':
		//updatePistes();
		//await closeDb();
		break;
	case 'lifts':
		//updateLifts();
		//await closeDb();
		break;
	case 'skiAreas':
		//updateSkiAreas();
		//await closeDb();
		break;
	case 'facilities':
		//updateFacilities();
		//await closeDb();
		break;
	case 'ratings':
		//updateRatings();
		//await closeDb();
		break;
	case 'all':
		//updateUsers();
		//updatePistes();
		//updateLifts();
		//updateSkiAreas();
		//updateFacilities();
		//updateRatings();
		//await closeDb();
		break;
	default:
		console.error('Invalid argument');
		console.log('Usage: node dbUpdate.js <users|pistes|lifts|skiAreas|facilities|ratings|all>');
		//await closeDb();
}

async function closeDb() {
	await db.close();
}