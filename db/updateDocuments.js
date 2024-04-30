import UserModel from '../models/User.js';
import PisteModel from '../models/Pistes.js';
import LiftModel from '../models/Lifts.js';
import SkiAreaModel from '../models/SkiAreas.js';
import FacilityModel from '../models/Facilities.js';
import RatingModel from '../models/Ratings.js';
import c from 'ansi-colors';

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
			},
		}, { disablePrint: true }
		);
	}

	console.log(c.green('[Success] Users have been updated'));
}

async function updatePistes() {
	const pistes = await PisteModel.find();
	for (const piste of pistes) {
		await PisteModel.findOneAndUpdate({ _id: piste._id }, {
			name: piste._doc.name,
			skiAreaId: piste._doc.skiAreaId,
			direction: piste._doc.direction,
			weight: piste._doc.weight,
		}, { disablePrint: true });
	}

	console.log(c.green('[Success] Pistes have been updated'));
}

async function updateLifts() {
	const lifts = await LiftModel.find();
	for (const lift of lifts) {
		await LiftModel.findOneAndUpdate({ _id: lift._id }, {
			name: lift._doc.name,
			skiAreaId: lift._doc.type,
		}, { disablePrint: true });
	}

	console.log(c.green('[Success] Lifts have been updated'));
}

async function updateSkiAreas() {
	const skiAreas = await SkiAreaModel.find();
	for (const skiArea of skiAreas) {
		await SkiAreaModel.findOneAndUpdate({ _id: skiArea._id }, {
			name: skiArea._doc.name,
			region: skiArea._doc.region,
			country: skiArea._doc.country,
			website: skiArea._doc.website,
			bounds: skiArea._doc.bounds,
		}, { disablePrint: true });
	}

	console.log(c.green('[Success] Ski areas have been updated'));
}

async function updateFacilities() {
	const facilities = await FacilityModel.find();
	for (const facility of facilities) {
		await FacilityModel.findOneAndUpdate({ _id: facility._id }, {
			name: facility._doc.name,
			type: facility._doc.type,
		}, { disablePrint: true });
	}

	console.log(c.green('[Success] Facilities have been updated'));
}

async function updateRatings() {
	const ratings = await RatingModel.find();
	for (const rating of ratings) {
		await RatingModel.findOneAndUpdate({ _id: rating._id }, {
			piste: rating._doc.piste,
			skiAreaId: rating._doc.skiAreaId,
			rating: rating._doc.rating,
			weather: rating._doc.weather,
		}, { disablePrint: true });
	}

	console.log(c.green('[Success] Ratings have been updated'));
}

export { updateUsers, updatePistes, updateLifts, updateSkiAreas, updateFacilities, updateRatings };