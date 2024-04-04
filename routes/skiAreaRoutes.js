import express from 'express'; 
import SkiAreaModel from '../models/SkiAreas.js';
import err from '../utils/errorCodes.js';
import checkParams from '../utils/checkParams.js';
import getQuery from '../utils/getQuery.js';
import axios from 'axios';
import { overpassToGeoJson } from '../utils/dataFormatter.js';
// import savePistesFromArea from '../data_generation/savePistesFromArea.js';
//import getCurrentWeather from '../utils/getWeather.js';

const router = express.Router();

router.get('/:id', 
/**
 * GET request for ski area by ID
 * @param {*} req request object
 * @param {*} res response object
 * @returns 
 */
async (req, res) => {
	const id = req.params.id.toString();

	if (checkParams([{
		name: 'ski area id',
		value: id,
		id: true
	}], res)) {
		return;
	}

	const skiArea = await SkiAreaModel.findById(id);

	if (!skiArea) {
		return res.status(400).send(err.skiArea.notFound);
	}

	const query = getQuery(skiArea.bounds);

	const geoJson = await axios.post('https://overpass-api.de/api/interpreter', query);
	if (!geoJson?.data) {
		return res.status(500).send(err.routeGeneration.overpassApiError);
	}

	// const weather = await getCurrentWeather();
	// console.log(weather.current, weather.hourly.snow_depth, weather.hourly.visibility);

	// TODO: Only run this function if the user has admin roles
	// await savePistesFromArea(overpassToGeoJson(geoJson.data), skiArea);

	return res.status(200).send({
		skiArea: skiArea,
		geoJson: overpassToGeoJson(geoJson.data)
	});
});


export default router;