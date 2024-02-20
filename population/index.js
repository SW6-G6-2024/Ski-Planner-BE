const { connectToDb } = require('../db');
const keys = require('../config/keys');
const { SkiAreaModel } = require('../models/SkiAreas');

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

// Create a ski area object based on trysil
const skiArea = {
	name: 'Trysil',
	country: 'Norway',
	region: 'Hedmark',
	website: 'https://www.trysil.com',
	bounds: [0, 0, 0, 0],
	pistes: [],
	lifts: [],
	facilities: [],
}


const skiAreaInstance = SkiAreaModel(skiArea);
skiAreaInstance.save()
	.then(() => {
		console.log('SkiArea saved');
	})
	.catch((err) => {
		console.log(err);
	});
