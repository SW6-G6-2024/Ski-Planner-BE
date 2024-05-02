import axios from 'axios';
import express from 'express';
import err from '../utils/errorCodes.js';
// eslint-disable-next-line no-unused-vars
import { isPoint } from '../utils/validators/pointValidator.js';
import { isPreference } from '../utils/validators/preferenceValidator.js';
import checkParams from '../utils/validators/checkParams.js';
import getQuery from '../utils/helpers/getQuery.js';
import { findSkiArea } from '../utils/helpers/queryInDB.js';
import getAreaCenter from '../utils/helpers/getAreaCenter.js';
import getCurrentWeather from '../utils/helpers/getWeather.js';
import { getPredictedRatings, consolidateRatingInGeoJSON } from '../utils/helpers/predictedRatings.js';
import generateRoute from '../utils/helpers/generateRoute.js';

const router = express.Router();

router.post('/generate-route',
	/**
	 * POST request for generating shortest route between two points
	 * @param {Express.Request} req request object
	 * @param {Express.Response} res response object
	 * @returns 
	 */
	async (req, res) => {
		const { start, end, skiArea, settings, isBestRoute } = req.body;
		if (checkInput({start, end, skiArea, settings, isBestRoute}, res)) {
			return;
		}

		let skiAreaInstance;

		try {
			skiAreaInstance = await findSkiArea(skiArea);
		} catch {
			return res.status(400).send(err.skiArea.notFound);
		}

		const query = getQuery(skiAreaInstance.bounds, settings);

		const apiRes = await axios.post('https://overpass-api.de/api/interpreter', query);
		if (!apiRes?.data)
			return res.status(500).send(err.routeGeneration.overpassApiError);

		const centerBounds = getAreaCenter(skiAreaInstance.bounds);
		let result;
		try {
			const weatherObj = await getCurrentWeather(centerBounds.lat, centerBounds.lon);
			const prediction = await getPredictedRatings(apiRes.data, weatherObj);

			const geoJson = await consolidateRatingInGeoJSON(prediction, apiRes.data);

			result = await generateRoute(start, end, isBestRoute, geoJson);
		} catch (error) {
			return res.status(500).send(error);
		}

		// Only pass the shortest route and not the step-by-step guide
		if (checkResult(result?.[0], res)) {
			return;
		}

		return res.status(200).send({ res: result });
	});

/**
 * This function checks if the result is valid or not (i.e. if data and 
 * data.features are present in the result object) and sends the appropriate 
 * response if not.
 * @param {import('axios').AxiosResponse} result The result object to check
 * @param {Express.Response} res The express response object to send the response to
 * @returns Sends the appropriate response if the result is invalid
 */
function checkResult(result, res) {
	if (!result) {
		res.status(500).send(err.routeGeneration.routeGenerationError);
		return true;
	}

	if (!result.features || !result.features.length) {
		res.status(400).send(err.routeGeneration.noRouteFound);
		return true;
	}
}

/**
 * This function checks if the input is valid or not (i.e. if start and end are valid points and skiArea is a valid ID) and sends the appropriate response if not.
 * @param 
 * @param {Express.Response} res The express response object
 * @returns Sends the appropriate response if the input is invalid and returns true, otherwise returns false
 */
function checkInput(input, res) {
	return checkParams([{
		name: 'start point',
		value: input.start,
		func: isPoint,
		funcErr: err.routeGeneration.invalidPoint,
	}, {
		name: 'end point',
		value: input.end,
		func: isPoint,
		funcErr: err.routeGeneration.invalidPoint,
	}, {
		name: 'skiArea',
		value: input.skiArea,
		id: true,
	}, {
		name: 'settings',
		value: input.settings,
		func: isPreference,
		funcErr: err.routeGeneration.invalidPreferenceInput,
	}, {
		name: 'isBestRoute',
		value: input.isBestRoute,
		func: (val) => typeof val === 'boolean',
		funcErr: err.routeGeneration.invalidBestRouteInput,
	},
	], res);
}

export default router;