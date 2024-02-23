import express from 'express'; 
import SkiAreaModel from '../models/SkiAreas.js';
import err from '../utils/errorCodes.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/:id', async (req, res) => {
	const id = req.params.id.toString();

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send(err.skiArea.invalidId);
	}

	const skiArea = await SkiAreaModel.findById(id);

	return res.status(200).send(skiArea);

		
});

export default router;