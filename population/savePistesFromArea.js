import PistesModel from "../models/Pistes.js";
import err from "../utils/errorCodes.js";
import mongoose, { get } from "mongoose";
import getQuery from "../utils/getQuery.js";
import getPisteDirection from "../utils/getPisteDirection.js";

/**
 * Function that saves pistes from a ski area to the database
 * @param {Object} geoJson - The geoJson object with the pistes/ or other features
 * @param {String} skiAreaId - The id of the ski area
 * @returns void
 */
async function savePistesFromArea(obj, skiAreaId) {
  checkParams(obj, skiAreaId)
  for (let i = 0; i < obj.features.length; i++) {
    const pisteData = obj.features[i];
    if (pisteData.properties["piste:type"] === "downhill") {
      try {
        await PistesModel.findOneAndUpdate({ id: pisteData.id }, {
          $set: {
            id: pisteData.id,
            name: pisteData.properties.name ?? pisteData.properties.ref ?? "Unknown",
            skiAreaId: skiAreaId,
            direction: getPisteDirection(pisteData.geometry.coordinates),
          }
        }, { upsert: true })
      } catch (error) {
        throw err.pistes.saveError;
      }
    }
  }
}

export default savePistesFromArea;

function checkParams(obj, skiAreaId) {
  // Check if the skiAreaId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(skiAreaId)) {
    throw err.general.invalidId(skiAreaId);
  }
  // Check if the object is a valid GeoJson object
  if (obj.type !== "FeatureCollection" && obj.type !== "Feature") {
    throw err.geoJson.invalidObject;
  }
}