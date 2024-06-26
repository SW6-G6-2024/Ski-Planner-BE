import PistesModel from "../models/Pistes.js";
import err from "../utils/errorCodes.js";
import mongoose from "mongoose";
import getPisteDirection from "../utils/helpers/getPisteDirection.js";
import { randn_bm } from "../data_generation/helpers/dataFiller.js";

/**
 * Function that saves pistes from a ski area to the database
 * @param {Feature | FeatureCollection} obj - The geoJson object with the pistes/ or other features
 * @param {String} skiAreaId - The id of the ski area
 */
async function savePistesFromArea(obj, skiAreaId) {
  checkParams(obj, skiAreaId);
  for (let i = 0; i < obj.features.length; i++) {
    const pisteData = obj.features[i];
    /* istanbul ignore next */
    if (pisteData.properties["piste:type"] === "downhill") {
      try {
        await PistesModel.findOneAndUpdate({ _id: pisteData.id }, {
          $set: {
            _id: pisteData.id,
            name: pisteData.properties.name ?? pisteData.properties.ref ?? "Unknown",
            skiAreaId: skiAreaId,
            direction: getPisteDirection(pisteData.geometry.coordinates),
            weight: randn_bm(0, 2, 1)
          }
        }, { upsert: true, disablePrint: true});
      } catch (error) {
        console.error(error);
        /* istanbul ignore next */
        throw err.pistes.saveError;
      }
    }
  }
}

export default savePistesFromArea;

/**
 * Function that checks the parameters of the function savePistesFromArea
 * The object must be a valid GeoJson object and the skiAreaId must be a valid ObjectId
 * Throws an error if the parameters are invalid
 * @param {Feature | FeatureCollection} obj the geoJson object with the pistes
 * @param {String} skiAreaId the id of the ski area
 */
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