import UserModel from '../models/User.js';

async function updateUsers() {
	const users = await UserModel.find();
	for (const user of users) {
		await UserModel.findOneAndUpdate({ _id: user._id }, {
			preferences: {
				pisteDifficulties: {
					green: user._doc.preferences.pisteDifficulties.green,
					blue: user._doc.preferences.pisteDifficulties.blue,
					red: user._doc.preferences.pisteDifficulties.red,
					black: user._doc.preferences.pisteDifficulties.black,
				},
				liftTypes: {
					gondola: user._doc.preferences.liftTypes?.gondola,
					chairlift: user._doc.preferences.liftTypes?.chairlift,
					tBar: user._doc.preferences.liftTypes?.tBar,
					platter: user._doc.preferences.liftTypes?.platter,
				},
				createdAt: user._doc.createdAt,
			},
		}
		);
	}

	console.log('Users updated');
}

async function updatePistes() {
	const pistes = await PisteModel.find();
	for (const piste of pistes) {
		await PisteModel.findOneAndUpdate({ _id: piste._id }, {
			name: piste._doc.name,
			skiAreaId: piste._doc.skiAreaId,
			direction: piste._doc.direction,
			createdAt: piste._doc.createdAt,
		});
	}

	console.log('Pistes updated');
}

export { updateUsers };