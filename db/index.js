import mongoose from 'mongoose';

function connectToDb(uri, options = {}) {

	mongoose.connect(uri, options);

	const db = mongoose.connection;
	db.on('error', console.error.bind(console, 'MongoDB connection error'));

	return db;
}

export { connectToDb };