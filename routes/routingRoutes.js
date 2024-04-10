import axios from 'axios';
import express from 'express';
import err from '../utils/errorCodes.js';
// eslint-disable-next-line no-unused-vars
import { isPoint } from '../utils/pointValidator.js';
import SkiArea from '../models/SkiAreas.js';
import checkParams from '../utils/checkParams.js';
import getQuery from '../utils/getQuery.js';
import env from '../config/keys.js';

const router = express.Router();

router.post('/generate-route', 
/**
 * POST request for generating shortest route between two points
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @returns 
 */
async (req, res) => {
	const { start, end, skiArea } = req.body;
	if (checkParams([{
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
		}
	], res)) {
		return;
	}

	const skiAreaInstance = await SkiArea.findById(skiArea);

	if (!skiAreaInstance)
		return res.status(400).send(err.skiArea.notFound);

	const bounds = skiAreaInstance.bounds;

	const query = getQuery(bounds);

	const apiRes = await axios.post('https://overpass-api.de/api/interpreter', query);
	if (!apiRes?.data)
		return res.status(500).send(err.routeGeneration.overpassApiError);

	// Call the route generation service
	let result;
	try {
		result = await axios.post(env.pathFindingUrl + '/generate-route', {
			data: {
				start: start,
				end: end,
				geoJson: apiRes.data,
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
	if(!result) {
		res.status(500).send(err.routeGeneration.routeGenerationError);
		return true;
	}

	if(!result.features || !result.features.length) {
		res.status(400).send(err.routeGeneration.noRouteFound);
		return true;
	}
}

export default router;