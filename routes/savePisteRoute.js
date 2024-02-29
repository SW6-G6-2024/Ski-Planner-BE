import SkiAreaModel from '../models/SkiAreas.js';
import checkParams from '../utils/checkParams.js';
import getQuery from '../utils/getQuery.js';
import axios from 'axios';

async function savePistesFromArea() {
  const id = "65d4a9dbecaa09d942314101";

	if (checkParams([{
		name: 'ski area id',
		value: id,
		id: true
	}], res)) {
		return;
	}

	const skiArea = await SkiAreaModel.findById(id);

	if (!skiArea) {
		return "error 1"
	}

	const query = getQuery(skiArea.bounds);

	const geoJson = await axios.post('https://overpass-api.de/api/interpreter', query);
	if (!geoJson?.data) {
		return "error 2"
	}

  return "success"

  /*
	return res.status(200).send({
		skiArea: skiArea,
		geoJson: overpassToGeoJson(geoJson.data)
	});
  */
};
