import express from 'express'; 
import SkiAreaModel from '../models/SkiAreas.js';
import err from '../utils/errorCodes.js';
import checkParams from '../utils/checkParams.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
	const id = req.params.id.toString();

	if (checkParams([{
		name: 'ski area id',
		value: id,
		id: true
	}], res)) {
		return;
	}

	const skiArea = await SkiAreaModel.findById(id);

	if (!skiArea) {
		return res.status(400).send(err.skiArea.notFound);
	}

	return res.status(200).send(skiArea);
});


export default router;