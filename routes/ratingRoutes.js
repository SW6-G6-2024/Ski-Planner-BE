import express from 'express';
import err from '../utils/errorCodes.js';
// eslint-disable-next-line no-unused-vars
import { isRating } from '../utils/ratingValidator.js';
import { isPisteId } from '../utils/pisteIdValidator.js';
import checkParams from '../utils/checkParams.js';
import getCurrentWeather from '../utils/getWeather.js';
import SkiAreaModel from '../models/SkiAreas.js';
import PisteModel from '../models/Pistes.js';
import RatingsModel from '../models/Ratings.js';

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
			func: isPisteId,
			funcErr: err.pistes.invalidPisteId,
		}
	], res)) {
		return;
	}
	
	const piste = await PisteModel.findOne({ _id: id });

	if (!piste) {
		return res.status(400).send(err.pistes.notFound);
	}

	const skiArea = await SkiAreaModel.findById(piste.skiAreaId);

	if (!skiArea) {
		return res.status(400).send(err.skiArea.notFound);
	}

	
	const lat = (skiArea.bounds[0] + skiArea.bounds[2]) / 2;
	const lon = (skiArea.bounds[1] + skiArea.bounds[3]) / 2;
	
	const date = new Date();
	const currentHour = date.getHours();
	
	try {
		const weather = await getCurrentWeather(lat.toFixed(4), lon.toFixed(4));
		const weatherForRating = {
			temperature: weather.current.temperature_2m,
			rain: weather.current.rain,
			snowfall: weather.current.snowfall,
			weatherCode: weather.current.weather_code,
			windSpeed: weather.current.wind_speed_10m,
			windDirection: weather.current.wind_direction_10m,
			snowDepth: weather.hourly.snow_depth[currentHour],
			visibility: weather.hourly.visibility[currentHour],
		};
		
		const newRating = new RatingsModel({
			piste: parseInt(id, 10),
			skiAreaId: skiArea._id,
			rating: parseInt(rating, 10),
			weather: weatherForRating
		});

		await newRating.save();
		res.status(200).send("Successfully rated piste");
	} catch (error) {
		res.status(400).send(error);
	}
});

export default router;