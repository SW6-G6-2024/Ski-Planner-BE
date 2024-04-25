import errorCodes from "../errorCodes.js";
import axios from "axios";
import env from "../../config/keys.js";

async function generateRoute(start, end, geoJson) {
	const result = await axios.post(env.pathFindingUrl + '/generate-route', {
		data: {
			start: start,
			end: end,
			geoJson: geoJson,
		}
	});

	if (result.status !== 200) {
		throw errorCodes.routeGeneration.routeGenerationError;
	}

	return result.data;
}

export default generateRoute;