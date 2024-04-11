import PistesModel from "../models/Pistes.js";
import err from "../utils/errorCodes.js";
import mongoose from "mongoose";
import getQuery from "../utils/getQuery.js";
import axios from "axios";
import { overpassToGeoJson } from "../utils/dataFormatter.js";
import { connectToDb } from "../db/index.js";
import env from "../config/keys.js";

/**
 * Function that saves pistes from a ski area to the database
 * @param {Object} geoJson - The geoJson object with the pistes/ or other features
 * @param {String} skiAreaId - The id of the ski area
 * @returns void
 */
async function savePistesFromArea(obj, skiAreaId) {
  // if skiAreaId is not a mongoose ObjectId, return an error
  if (!mongoose.Types.ObjectId.isValid(skiAreaId)) {
    throw err.general.invalidId(skiAreaId);
  }

  // if the object is not a valid geoJson object, return an error
  if (obj.type !== "FeatureCollection" && obj.type !== "Feature") {
    throw err.geoJson.invalidObject;
  }

  for (let i = 0; i < obj.features.length; i++) {
    const pisteData = obj.features[i];
    if (pisteData.properties["piste:type"] === "downhill") {
      try {
        await PistesModel.findOneAndUpdate({ id: pisteData.id }, {
          id: pisteData.id,
          name: pisteData.properties.name ?? pisteData.properties.ref ?? "Unknown",
          skiAreaId: skiAreaId,
          direction: "n",
        }, { upsert: true });
      } catch {
        throw err.pistes.saveError;
      }
    }
  }
}

export default savePistesFromArea;

const query = getQuery([
  61.29560770030594,
  12.127237063661534,
  61.33240275253347,
  12.266869460358693
])

const overpass = await axios.post('https://overpass-api.de/api/interpreter', query);
const geoJson = overpassToGeoJson(overpass.data);

console.log('Checking for duplicates...');
for (let i = 0; i < geoJson.features.length; i++) {
  for (let j = 0; j < geoJson.features.length; j++) {
    if (geoJson.features[i].id === geoJson.features[j].id && i !== j) {
      console.log(geoJson.features[i].properties.name, geoJson.features[j].properties.name)
    }
  }
}

const db = connectToDb(env.mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const res = await savePistesFromArea(geoJson, "65d4a9dbecaa09d942314101");
db.close();