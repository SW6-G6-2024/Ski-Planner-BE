import { connectToDb } from './index.js';
import env from '../config/keys.js';
import UserModel from '../models/User.js';

const db = connectToDb(env.mongoURI);

const users = await UserModel.find({});

for (const user of users) {
	await updateUserDocument(user);
};

async function updateUserDocument(user) {
	await UserModel.findOneAndUpdate({ _id: user._id }, {
		_id: user._id,
		preferences: {
			pisteDifficulties: {
				green: user._doc.preferences.pisteDifficulty.green,
				blue: user._doc.preferences.pisteDifficulty.blue,
				red: user._doc.preferences.pisteDifficulty.red,
				black: user._doc.preferences.pisteDifficulty.black,
			},
			createdAt: user._doc.createdAt,
			modifiedAt: Date.now(),
		},
	}, { upsert: true }
	);
}

await db.close();