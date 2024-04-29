import axios from 'axios';
import express from 'express';
import err from '../utils/errorCodes.js';
// eslint-disable-next-line no-unused-vars
import { isPoint } from '../utils/pointValidator.js';
import checkParams from '../utils/checkParams.js';
import getQuery from '../utils/getQuery.js';
import env from '../config/keys.js';
import { findSkiArea } from '../utils/queryInDB.js';
import getAreaCenter from '../utils/getAreaCenter.js';
import getCurrentWeather from '../utils/getWeather.js';
import { getPredictedRatings, consolidateRatingInGeoJSON } from '../utils/predictedRatings.js';

const router = express.Router();

router.post('/generate-route',
	/**
	 * POST request for generating shortest route between two points
	 * @param {Express.Request} req request object
	 * @param {Express.Response} res response object
	 * @returns 
	 */
	async (req, res) => {
		const { start, end, skiArea, isBestRoute } = req.body;
		if (checkInput(start, end, skiArea, isBestRoute, res)) {
			return;
		}

		let skiAreaInstance;

		try {
			skiAreaInstance = await findSkiArea(skiArea);
		} catch {
			return res.status(400).send(err.skiArea.notFound);
		}

		const query = getQuery(skiAreaInstance.bounds);

		const apiRes = await axios.post('https://overpass-api.de/api/interpreter', query);
		if (!apiRes?.data)
			return res.status(500).send(err.routeGeneration.overpassApiError);

		const centerBounds = getAreaCenter(skiAreaInstance.bounds);
		let weatherObj, prediction;
		try {
			weatherObj = await getCurrentWeather(centerBounds.lat, centerBounds.lon);
			prediction = await getPredictedRatings(apiRes.data, weatherObj);
		} catch (error) {
			return res.status(500).send(error);
		}

		const geoJson = await consolidateRatingInGeoJSON(prediction, apiRes.data);

		// Call the route generation service
		let result;
		try {
			result = await axios.post(env.pathFindingUrl + '/generate-route', {
				data: {
					start: start,
					end: end,
					isBestRoute: isBestRoute,
					geoJson: geoJson,
				}
			});
		} catch (error) {
			return res.status(500).send(err.routeGeneration.routeGenerationError);
		}

		// Only pass the shortest route and not the step-by-step guide
		if (checkResult(result?.data?.[0], res)) {
			return;
		}

		return res.status(200).send({ route: 'Dis way!', res: result.data });
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
 * @param {node} start The start point of the route
 * @param {node} end The end point of the route
 * @param {String} skiArea The ID of the ski area
 * @param {Boolean} isBestRoute Whether the route is the best route or not
 * @param {Express.Response} res The express response object
 * @returns Sends the appropriate response if the input is invalid and returns true, otherwise returns false
 */
function checkInput(start, end, skiArea, isBestRoute, res) {
	return checkParams([{
		name: 'start point',
		value: start,
		func: isPoint,
		funcErr: err.routeGeneration.invalidPoint,
	}, {
		name: 'end point',
		value: end,
		func: isPoint,
		funcErr: err.routeGeneration.invalidPoint,
	}, {
		name: 'skiArea',
		value: skiArea,
		id: true,
	}, {
		name: 'isBestRoute',
		value: isBestRoute,
		func: (val) => typeof val === 'boolean',
		funcErr: err.routeGeneration.invalidBestRouteInput,
	},
	], res);
}

export default router;