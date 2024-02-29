import SkiAreaModel from "../models/SkiAreas";
import err from "../utils/errorCodes";
import { overpassToGeoJson } from "../utils/dataFormatter";
import axios from "axios";
import getQuery from "../utils/getQuery";
import PistesModel from "../models/Pistes";

/**
 * Function that saves pistes from a ski area to the database
 * @returns 
 */
async function savePistesFromArea(id) {
  const skiArea = await SkiAreaModel.findById(id.toString());

  if (!skiArea) {
    throw new Error(err.skiArea.notFound);
  }

  const query = getQuery(skiArea.bounds);

  const geoJson = await axios.post('https://overpass-api.de/api/interpreter', query);
  if (!geoJson?.data) {
    throw new Error(err.routeGeneration.overpassApiError);
  }

  let result = overpassToGeoJson(geoJson.data);

  for (let i = 0; i < result.features.length; i++) {
    const pisteData = result.features[i];
    if (pisteData.properties["piste:type"] === "downhill") {
      await new PistesModel({
        name: pisteData.properties.name ?? "Unknown",
        skiAreaId: skiArea._id,
      }).save();
    }
  }
};

export default savePistesFromArea;
