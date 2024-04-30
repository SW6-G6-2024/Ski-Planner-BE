import { connectToDb } from './index.js';
import env from '../config/keys.js';
import { updateUsers, updatePistes, updateLifts, updateSkiAreas, updateFacilities, updateRatings } from './updateDocuments.js';

const db = connectToDb(env.mongoURI);

switch (process.argv[2]) {
	case 'users':
		await updateUsers();
		await closeDb();
		break;
	case 'pistes':
		await updatePistes();
		await closeDb();
		break;
	case 'lifts':
		await updateLifts();
		await closeDb();
		break;
	case 'skiAreas':
		await updateSkiAreas();
		await closeDb();
		break;
	case 'facilities':
		await updateFacilities();
		await closeDb();
		break;
	case 'ratings':
		await updateRatings();
		await closeDb();
		break;
	case 'all':
		await updateUsers();
		await updatePistes();
		await updateLifts();
		await updateSkiAreas();
		await updateFacilities();
		await updateRatings();
		await closeDb();
		break;
	default:
		console.error('Invalid argument');
		console.log('Usage: node dbUpdate.js <users|pistes|lifts|skiAreas|facilities|ratings|all>');
		await closeDb();
}

async function closeDb() {
	await db.close();
}