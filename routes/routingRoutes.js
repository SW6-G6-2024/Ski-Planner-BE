import axios from 'axios';
import express from 'express';
import err from '../utils/errorCodes.js';
import { isPoint } from '../utils/pointValidator.js';
import SkiArea from '../models/SkiAreas.js';
import checkParams from '../utils/checkParams.js';

const router = express.Router();

// Routes
router.post('/generate-route', async (req, res) => {
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

	//find ski area in db
	const skiAreaInstance = await SkiArea.findById(skiArea);
	if (!skiAreaInstance)
		return res.status(400).send(err.skiArea.notFound);

	const bounds = skiAreaInstance.bounds;

	const query =
		`
[out:json];
(
  // Fetch downhill pistes within the bounding box
  way["piste:type"="downhill"](${bounds[0]},${bounds[1]},${bounds[2]},${bounds[3]});
  // Fetch all ski lifts within the bounding box
  way["aerialway"](${bounds[0]},${bounds[1]},${bounds[2]},${bounds[3]});
);
out geom;
	`;

	const geoJson = await axios.post('https://overpass-api.de/api/interpreter', query);
	if (!geoJson?.data)
		return res.status(500).send(err.routeGeneration.overpassApiError);

	// Call the route generation service
	let result;
	try {
		result = await axios.post('http://localhost:3500/generate-route', {
			data: {
				start: start,
				end: end,
				geoJson: geoJson.data,
			}
		});
	} catch (error) {
		return res.status(500).send(err.routeGeneration.routeGenerationError);
	}


	return res.status(200).send({ route: 'Dis way!', res: result.data.data.geoJson.elements[0].geometry });
});

export default router;