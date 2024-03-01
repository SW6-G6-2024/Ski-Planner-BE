import axios from 'axios';
import express from 'express';
import err from '../utils/errorCodes.js';
// eslint-disable-next-line no-unused-vars
import { isPoint } from '../utils/pointValidator.js';
import SkiArea from '../models/SkiAreas.js';
import checkParams from '../utils/checkParams.js';
import getQuery from '../utils/getQuery.js';

const router = express.Router();

router.post('/generate-route', 
/**
 * POST request for generating shortest route between two points
 * @param {*} req request object
 * @param {*} res response object
 * @returns 
 */
async (req, res) => {
	const { start, end, skiArea } = req.body;
	if (checkParams([{
			name: 'start point',
			value: start,
			// func: isPoint,
			// funcErr: err.routeGeneration.invalidPoint,
		}, {
			name: 'end point',
			value: end,
			// func: isPoint,
			// funcErr: err.routeGeneration.invalidPoint,
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
		result = await axios.post('http://127.0.0.1:3500/generate-route', {
			data: {
				start: start,
				end: end,
				geoJson: apiRes.data,
			}
		});
	} catch (error) {
		return res.status(500).send(err.routeGeneration.routeGenerationError);
	}

	if(!result.data)
		return res.status(500).send(err.routeGeneration.routeGenerationError);

	return res.status(200).send({ route: 'Dis way!', res: result.data.features[0] });
});

export default router;