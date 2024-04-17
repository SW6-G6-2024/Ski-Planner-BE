import { connectToDb } from '../../db/index.js';
import keys from '../../config/keys.js';
import PistesModel from '../../models/Pistes.js';

/**
 * Opens connection to database and finds all piste entries in database
 * @returns {Promise<Array<Piste>>} array of piste objects
 */
async function getPistes() {
	/* istanbul ignore next */
	const db = connectToDb(keys.mongoURI, {
		dbName: process.env.NODE_ENV === 'production' ? 'prod' : 'test',
	});
	const pistes = await PistesModel.find({});
	db.close();
	return pistes;
}

export default getPistes;