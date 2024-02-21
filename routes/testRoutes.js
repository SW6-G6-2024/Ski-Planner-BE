import express from 'express';
const router = express.Router();
import SkiAreaModel from '../models/SkiAreas.js';

// Routes
router.get('/', (req, res) => {
	res.send('Hello World');
});

router.post('/create-ski-area', (req, res) => {
	const skiArea = {
		name: 'test',
		country: 'test',
		region: 'test',
		website: 'https://www.test.com',
		bounds: [0, 0, 0, 0],
		pistes: [],
		lifts: [],
		facilities: [],
	};
	
	const skiAreaInstance = SkiAreaModel(skiArea);
	skiAreaInstance.save()
		.then(() => {
			console.log('SkiArea saved');
		})
		.catch((err) => {
			console.log(err);
		});

		return res.send('SkiArea saved');
	});

export default router;