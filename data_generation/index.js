import { connectToDb } from '../db/index.js';
import keys from '../config/keys.js';
import SkiAreaModel from '../models/SkiAreas.js';
import PistesModel from '../models/Pistes.js';
import axios from 'axios';

// eslint-disable-next-line no-unused-vars
const getWeather =async (lat, long) => {
	// eslint-disable-next-line no-unused-vars
	const params = {
		"latitude": lat,
		"longitude": long,
		"hourly": ["temperature_2m", "rain", "snowfall", "snow_depth", "weather_code"],
		"timezone": "auto",
		"forecast_days": 1
	};

	const weather = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,snowfall,weather_code,wind_speed_10m&timezone=auto&forecast_days=1`);

	console.log(weather.data);
};

let db = connectToDb(keys.mongoURI, {
	dbName: process.env.NODE_ENV === 'production' ? 'prod' : 'test',
}, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

db.on('connected', () => {
	console.log('Connected to DB');
});

const skiArea = {
	name: 'Trysil2',
	country: 'Norway',
	region: 'Hedmark',
	website: 'https://www.trysil.com',
	bounds: [0, 0, 0, 0],
	pistes: [],
	lifts: [],
	facilities: [],
};

// eslint-disable-next-line no-unused-vars
const rating = {
	piste: '65d70e9837424eef28ccb066',
	rating: 5,
	weather: getWeather(61.3077, 12.173),
};

const piste = {
	name: '32',
	difficulty: 'Black',
	grooming: true,
};

const pisteInstance = PistesModel(piste);
pisteInstance.save()
	.then(() => {
		console.log('Piste saved');
	})
	.catch((err) => {
		console.log(err);
	});


const skiAreaInstance = SkiAreaModel(skiArea);
skiAreaInstance.save()
	.then(() => {
		console.log('SkiArea saved');
	})
	.catch((err) => {
		console.log(err);
	});
