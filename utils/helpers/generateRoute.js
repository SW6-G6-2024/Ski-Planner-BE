import errorCodes from "../errorCodes.js";
import axios from "axios";
import env from "../../config/keys.js";

async function generateRoute(start, end, isBestRoute, geoJson) {
	let result;
	try {
		result = await axios.post(env.pathFindingUrl + '/generate-route', {
			data: {
				start: start,
				end: end,
				isBestRoute: isBestRoute,
				geoJson: geoJson,
			}
		});
	} catch (error) {
		throw errorCodes.routeGeneration.routeGenerationError;
	}
	
	return result.data;
}

export default generateRoute;