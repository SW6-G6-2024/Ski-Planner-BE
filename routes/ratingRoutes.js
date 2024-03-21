import axios from 'axios';
import express from 'express';
import err from '../utils/errorCodes.js';
// eslint-disable-next-line no-unused-vars
import { isRating } from '../utils/ratingValidator.js';
import SkiArea from '../models/SkiAreas.js';
import checkParams from '../utils/checkParams.js';
import getQuery from '../utils/getQuery.js';
import env from '../config/keys.js';
// import savePistesFromArea from '../data_generation/savePistesFromArea.js';

const router = express.Router();

router.post('/:id', 
/**
 * POST request for generating shortest route between two points
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @returns 
 */
async (req, res) => {
	const { rating } = req.body;
  const id = req.params.id.toString();

	if (checkParams([{
			name: 'rating',
			value: rating,
			func: isRating,
			funcErr: err.pistes.invalidRatingInterval,
		}, {
			name: 'piste',
			value: id,
			id: true,
		}
	], res)) {
		return;
	}

  console.log(rating, id)

  return res.status(202).send("Rating added successfully");

  // TODO: Change this to find a piste instead of skiArea
	// const skiAreaInstance = await SkiArea.findById(skiArea);

	// if (!skiAreaInstance)
	// 	return res.status(400).send(err.skiArea.notFound);
});

export default router;