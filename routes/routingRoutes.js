import axios from 'axios';
import express from 'express';
import err from '../utils/errorCodes.js';
import { isPoint } from '../utils/pointValidator.js';
import mongoose from 'mongoose';
import SkiArea from '../models/SkiAreas.js';
const router = express.Router();

// Routes
router.post('/generate-route', async (req, res) => {
	const { start, end, skiArea } = req.body;
	if (!start || !end) 
		return res.status(400).send(err.routeGeneration.missingPoint);
	if (!skiArea) 
		return res.status(400).send(err.routeGeneration.missingSkiArea);
	if(!isPoint(start) || !isPoint(end))
		return res.status(400).send(err.routeGeneration.invalidPoint);
	if(!mongoose.Types.ObjectId.isValid(skiArea))
		return res.status(400).send(err.routeGeneration.invalidSkiArea);

	//find ski area in db
	const skiAreaInstance = await SkiArea.findById(skiArea);

	// TODO: Generate graph for ski area
	

	// Call the route generation service
	const result = await axios.post('http://localhost:3500/generate-route', {
		data: {
			start: start,
			end: end,
			skiArea: skiAreaInstance,
		}
	});
	return res.status(200).send({ route: 'Dis way!', res: result.data });
});

export default router;